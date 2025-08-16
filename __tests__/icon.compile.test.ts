describe("icon generator", () => {
  it("compiles and exports default", async () => {
    const mod = await import("../app/icon");
    expect(typeof mod.default).toBe("function");
  });
});
