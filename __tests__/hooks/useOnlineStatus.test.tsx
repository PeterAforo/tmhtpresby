import { renderHook, act } from "@testing-library/react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

describe("useOnlineStatus", () => {
  const originalNavigator = window.navigator;

  beforeEach(() => {
    localStorage.clear();
  });

  it("returns online status by default", () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it("updates when going offline", () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
  });

  it("updates when coming back online", () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current.isOffline).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it("stores last online timestamp in localStorage", () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    const stored = localStorage.getItem("tmhtpresby-last-online");
    expect(stored).toBeTruthy();
    expect(result.current.lastOnlineAt).toBeInstanceOf(Date);
  });
});
