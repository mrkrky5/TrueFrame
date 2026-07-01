/**
 * Pure-logic tests for navigationExit + interstitial cadence.
 * Run: npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

const TAB_HREF = {
  index: "/",
  explore: "/explore",
  routes: "/routes",
  saved: "/saved",
  settings: "/settings",
};

function hrefForReaderReturn(target) {
  switch (target.kind) {
    case "route":
      return `/routes/${target.routeId}`;
    case "dossier":
      return `/explore/media/${target.slug}`;
    case "tab":
      return TAB_HREF[target.tab];
  }
}

function shouldShowInterstitial(openCount, everyN) {
  return openCount > 0 && openCount % everyN === 0;
}

describe("hrefForReaderReturn", () => {
  it("maps all primary tabs", () => {
    for (const [tab, href] of Object.entries(TAB_HREF)) {
      assert.equal(hrefForReaderReturn({ kind: "tab", tab }), href);
    }
  });

  it("maps route and dossier returns", () => {
    assert.equal(hrefForReaderReturn({ kind: "route", routeId: "ww1-western" }), "/routes/ww1-western");
    assert.equal(hrefForReaderReturn({ kind: "dossier", slug: "shogun" }), "/explore/media/shogun");
  });
});

describe("interstitial cadence", () => {
  const N = 4;

  it("fires on every Nth open, not before", () => {
    assert.equal(shouldShowInterstitial(1, N), false);
    assert.equal(shouldShowInterstitial(3, N), false);
    assert.equal(shouldShowInterstitial(4, N), true);
    assert.equal(shouldShowInterstitial(8, N), true);
  });
});
