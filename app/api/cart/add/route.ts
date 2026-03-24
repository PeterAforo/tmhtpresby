import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

function generateSessionId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Get or create session ID
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart_session")?.value || generateSessionId();

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
      });
    }

    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true, stock: true, name: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    // Add or update cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Get updated cart count
    const cartItems = await prisma.cartItem.aggregate({
      where: { cartId: cart.id },
      _sum: { quantity: true },
    });

    const response = NextResponse.json({
      success: true,
      message: "Added to cart",
      cartCount: cartItems._sum.quantity || 0,
    });

    // Set cookie if new session
    response.cookies.set("cart_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
