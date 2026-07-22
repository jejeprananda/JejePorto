import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { getProjectBySlug } from "../../src/services/projects/getProjectBySlug";
import { getProjects } from "../../src/services/projects/getProjects";
import { getServices } from "../../src/services/catalog/getServices";
import { getStackGroups } from "../../src/services/stack/getStackGroups";

describe("portfolio sqlite getters", () => {
  before(async () => {
    const { execSync } = await import("node:child_process");
    execSync("npm run seed", { stdio: "inherit" });
  });

  it("returns four projects in sort order with angkasa dark bg", () => {
    const projects = getProjects();
    assert.equal(projects.length, 4);
    assert.deepEqual(
      projects.map((project) => project.slug),
      ["angkasa", "jfaa", "sakti", "skk"],
    );
    assert.equal(projects[0]?.iconHasDarkBg, true);
    assert.equal(projects[1]?.iconHasDarkBg, false);
  });

  it("returns a project by slug and null for unknown slug", () => {
    const project = getProjectBySlug("jfaa");
    assert.ok(project);
    assert.equal(project.title, "JFAA");
    assert.ok(project.longDescription.length > 40);
    assert.equal(getProjectBySlug("missing"), null);
  });

  it("returns four services with detail copy", () => {
    const services = getServices();
    assert.equal(services.length, 4);
    assert.equal(services[0]?.slug, "webapp");
    assert.ok(services[0]?.detailDescription.length > 40);
  });

  it("groups stack technologies", () => {
    const groups = getStackGroups();
    assert.equal(groups.length, 4);
    assert.equal(groups[0]?.title, "Frontend");
    assert.ok(groups[0]?.technologies.includes("Next.js"));
  });
});
