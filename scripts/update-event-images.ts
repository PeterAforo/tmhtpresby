import { prisma } from "../lib/db";

const images = [
  "/img/pictures/2/001.jpg",
  "/img/pictures/2/010.jpg",
  "/img/pictures/2/020.jpg",
  "/img/pictures/2/030.jpg",
  "/img/pictures/2/040.jpg",
  "/img/pictures/2/050.jpg",
  "/img/pictures/2/060.jpg",
  "/img/pictures/2/070.jpg",
  "/img/pictures/2/080.jpg",
  "/img/pictures/2/090.jpg",
];

async function main() {
  // First, list all events
  const events = await prisma.event.findMany({
    select: { id: true, slug: true, title: true, imageUrl: true },
    orderBy: { startDate: "asc" },
  });

  console.log("Found events:");
  events.forEach((e, i) => console.log(`${i + 1}. ${e.slug} - ${e.title}`));

  console.log("\nUpdating event images...");

  // Update each event with an image
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const imageUrl = images[i % images.length];
    
    await prisma.event.update({
      where: { id: event.id },
      data: { imageUrl },
    });
    console.log(`✅ Updated "${event.title}" with ${imageUrl}`);
  }

  console.log("\nDone! All events now have images.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
