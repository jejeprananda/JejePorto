import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { before, describe, it } from "node:test";

import { getProjectBySlug } from "../../src/services/projects/getProjectBySlug";
import { getProjects } from "../../src/services/projects/getProjects";
import { getServices } from "../../src/services/catalog/getServices";
import { getStackGroups } from "../../src/services/stack/getStackGroups";
import { getCvData } from "../../src/services/cv/getCvData";

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
      ["sakti", "angkasa", "jfaa", "skk"],
    );
    assert.equal(projects.filter((p) => p.isFlagship).length, 1);
    assert.equal(projects[0]?.isFlagship, true);
    assert.equal(projects[1]?.isFlagship, false);
    assert.equal(projects[2]?.isFlagship, false);
    assert.equal(projects[3]?.isFlagship, false);
    assert.equal(projects[1]?.iconHasDarkBg, true);
    assert.equal(projects[2]?.iconHasDarkBg, false);
  });

  it("returns SAKTI flagship detail with enterprise case study fields", () => {
    const project = getProjectBySlug("sakti");
    assert.ok(project);
    assert.equal(project.isFlagship, true);
    assert.equal(project.year, "2023 – Present");
    assert.equal(project.category, "Enterprise Financial Management System");
    assert.equal(project.role, "Frontend Developer");
    assert.equal(
      project.company,
      "Ministry of Finance of the Republic of Indonesia",
    );
    assert.equal(project.heroImage, "/images/projects/sakti/hero.png");
    assert.ok(project.gallery.length === 5);
    assert.ok(project.features.length >= 4);
    assert.ok(project.tech.includes("Angular"));
    assert.ok(project.tech.includes("Oracle Database"));
  });

  it("has public assets on disk for SAKTI case study images", () => {
    const project = getProjectBySlug("sakti");
    assert.ok(project);

    const publicRoot = join(process.cwd(), "public");
    const paths = [
      project.iconPath,
      project.heroImage,
      ...project.gallery.map((item) => item.imagePath),
    ];

    for (const assetPath of paths) {
      assert.ok(
        existsSync(join(publicRoot, assetPath.replace(/^\//, ""))),
        `missing public asset: ${assetPath}`,
      );
    }
  });

  it("returns a project by slug and null for unknown slug", () => {
    const project = getProjectBySlug("jfaa");
    assert.ok(project);
    assert.equal(project.title, "JFAA");
    assert.ok(project.longDescription.length > 40);
    assert.equal(getProjectBySlug("missing"), null);
  });

  it("returns nested project detail for a known slug", () => {
    const project = getProjectBySlug("angkasa");
    assert.ok(project);
    assert.equal(project.role, "Fullstack Developer");
    assert.ok(project.heroImage.includes("/images/projects/angkasa/"));
    assert.ok(project.features.length >= 1);
    assert.ok(project.gallery.length >= 1);
    assert.ok(project.tech.length >= 1);
    assert.ok(project.timeline.length === 6);
    assert.ok(project.challenges.length >= 1);
    assert.ok(project.results.length >= 1);
    assert.equal(project.timeline[0]?.phase, "Discovery");
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

  it("aggregates CV data from the portfolio", () => {
    const cv = getCvData();

    assert.equal(cv.name, "Jessy Prananda Ismail");
    assert.ok(cv.headline.length > 0);
    assert.ok(cv.summary.length > 40);

    const projects = getProjects();
    assert.equal(cv.experience.length, projects.length);
    assert.deepEqual(
      cv.experience.map((item) => item.slug),
      projects.map((project) => project.slug),
    );

    const sakti = cv.experience[0];
    assert.equal(sakti?.title, "SAKTI");
    assert.equal(sakti?.role, "Frontend Developer");
    assert.ok(sakti?.tech.includes("Angular"));
    assert.ok((sakti?.highlights.length ?? 0) > 0);

    const frontend = cv.skills.find((group) => group.title === "Frontend");
    assert.ok(frontend);
    assert.ok(frontend.skills.includes("Next.js"));

    const emails = cv.contacts.filter((contact) => contact.label === "Email");
    assert.equal(emails.length, 1);
    assert.match(emails[0]?.href ?? "", /^mailto:/);

    assert.ok(cv.services.length >= 1);
  });
});
