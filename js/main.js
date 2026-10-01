/**
 * Portfolio renderer — edit data/resume.json to update the site.
 * No build step required. Works on GitHub Pages.
 */

const DATA_URL = "./data/resume.json";

async function loadResume() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Could not load ${DATA_URL}`);
  return res.json();
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== undefined && value !== null) {
      node.setAttribute(key, value);
    }
  });
  children.forEach((child) => {
    if (child != null) node.append(child);
  });
  return node;
}

function renderHero(data) {
  document.getElementById("nav-name").textContent = data.name;
  document.getElementById("hero-name").textContent = data.name;
  document.getElementById("hero-title").textContent = data.title;
  document.getElementById("hero-tagline").textContent = data.tagline;
  document.title = `${data.name} — ${data.title}`;

  const email = document.getElementById("btn-email");
  email.href = `mailto:${data.contact.email}`;

  const linkedin = document.getElementById("btn-linkedin");
  linkedin.href = data.contact.linkedin;

  const github = document.getElementById("btn-github");
  github.href = data.contact.github;

  document.getElementById("summary").textContent = data.summary;
  document.getElementById("footer-copy").textContent = `© ${new Date().getFullYear()} ${data.name}`;
}

function renderExperience(items) {
  const root = document.getElementById("experience-list");
  root.replaceChildren();

  items.forEach((job) => {
    const list = el(
      "ul",
      {},
      job.highlights.map((h) => el("li", { text: h }))
    );

    root.append(
      el("article", { className: "job reveal" }, [
        el("div", { className: "job-period", text: job.period }),
        el("div", {}, [
          el("h3", { className: "job-role", text: job.role }),
          el("p", { className: "job-meta" }, [
            el("span", { text: job.company }),
            el("span", { text: job.location }),
          ]),
          list,
        ]),
      ])
    );
  });
}

function renderProjects(items) {
  const root = document.getElementById("project-list");
  root.replaceChildren();

  items.forEach((project) => {
    root.append(
      el("article", { className: "project reveal" }, [
        el("h3", { text: project.name }),
        el("p", { className: "project-type", text: project.type }),
        el(
          "div",
          { className: "stack" },
          project.stack.map((s) => el("span", { text: s }))
        ),
        el(
          "ul",
          {},
          project.highlights.map((h) => el("li", { text: h }))
        ),
      ])
    );
  });
}

function renderSkills(skills) {
  const root = document.getElementById("skills-grid");
  root.replaceChildren();

  Object.entries(skills).forEach(([group, items]) => {
    root.append(
      el("div", { className: "skill-group reveal" }, [
        el("h3", { text: group }),
        el(
          "ul",
          {},
          items.map((item) => el("li", { text: item }))
        ),
      ])
    );
  });
}

function renderEducation(education, certifications) {
  const eduRoot = document.getElementById("education-list");
  eduRoot.replaceChildren();

  education.forEach((edu) => {
    eduRoot.append(
      el("div", { className: "edu-item reveal" }, [
        el("h3", { text: edu.school }),
        el("p", {
          text: `${edu.degree} · ${edu.period}${edu.detail ? ` · ${edu.detail}` : ""}`,
        }),
      ])
    );
  });

  const certs = document.getElementById("certs-list");
  certs.replaceChildren();

  certifications.forEach((cert) => {
    const name = typeof cert === "string" ? cert : cert.name;
    const verifyUrl = typeof cert === "object" ? cert.verifyUrl : null;

    const children = [el("span", { className: "cert-name", text: name })];

    if (verifyUrl) {
      children.push(
        el("a", {
          className: "cert-verify",
          href: verifyUrl,
          text: "Verify credential",
          target: "_blank",
          rel: "noopener noreferrer",
        })
      );
    }

    certs.append(el("div", { className: "cert-card reveal" }, children));
  });
}

function renderContact(contact) {
  const root = document.getElementById("contact-row");
  const links = [
    { label: contact.email, href: `mailto:${contact.email}` },
    { label: "LinkedIn", href: contact.linkedin },
    { label: "GitHub", href: contact.github },
    { label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
  ];

  root.replaceChildren(
    ...links.map((link) =>
      el("a", {
        href: link.href,
        text: link.label,
        target: link.href.startsWith("http") ? "_blank" : undefined,
        rel: link.href.startsWith("http") ? "noopener" : undefined,
      })
    )
  );
}

function setupReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((n) => n.classList.add("visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((n) => io.observe(n));
}

function setupMenu() {
  const btn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

async function main() {
  setupMenu();

  try {
    const data = await loadResume();
    renderHero(data);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderEducation(data.education, data.certifications);
    renderContact(data.contact);
    document.querySelectorAll("#about, #experience, #projects, #skills, #education, #contact")
      .forEach((section) => section.classList.add("reveal"));
    setupReveal();
  } catch (err) {
    console.error(err);
    document.getElementById("summary").textContent =
      "Could not load resume data. Check data/resume.json.";
  }
}

main();
