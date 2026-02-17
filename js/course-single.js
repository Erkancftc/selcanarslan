;(() => {
  const DATA_URL = "data/course-types.json" // path now holds multiple types; ?type=key selects one

  const $ = (sel, root = document) => root.querySelector(sel)

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
  }

  // JSON içinde bazen string bazen array kullanacağım demiştin:
  // - string => <p> olarak bas
  // - array => her elemanı <p> bas
  // - object { html: "..."} => direkt html bas (tam özgürlük)
  function renderRich(targetEl, value) {
    if (!targetEl) return

    if (value == null) {
      targetEl.innerHTML = ""
      return
    }

    // { html: "<p>...</p>" } gibi
    if (typeof value === "object" && !Array.isArray(value) && "html" in value) {
      targetEl.innerHTML = String(value.html || "")
      return
    }

    const arr = Array.isArray(value) ? value : [value]
    targetEl.innerHTML = arr
      .filter(v => v != null && String(v).trim() !== "")
      .map(v => `<p>${escapeHtml(v)}</p>`)
      .join("")
  }

  function setBgImage(el, url) {
    if (!el) return
    if (url) el.style.backgroundImage = `url(${url})`
  }

  function renderBreadcrumb(items) {
    const ol = $("#js-breadcrumb")
    if (!ol) return
    ol.innerHTML = ""

    ;(items || []).forEach((it, idx) => {
      const li = document.createElement("li")
      const isLast = idx === items.length - 1

      if (isLast || it.active) {
        li.className = "active"
        li.textContent = it.label ?? ""
      } else {
        const a = document.createElement("a")
        a.href = it.href || "#"
        a.textContent = it.label ?? ""
        li.appendChild(a)
      }
      ol.appendChild(li)
    })
  }

  function renderMetaCards(metaCards) {
    const wrap = $("#js-meta-left")
    const tpl = $("#tpl-meta-card")
    if (!wrap || !tpl) return

    wrap.innerHTML = ""

    ;(metaCards || []).forEach(card => {
      const node = tpl.content.cloneNode(true)

      const left = node.querySelector('[data-role="left"]')
      const labelLink = node.querySelector('[data-role="labelLink"]')
      const value = node.querySelector('[data-role="value"]')

      // soldaki ikon ya da avatar
      if (left) {
        if (card.left?.type === "avatar") {
          left.classList.add("rounded-circle")
          left.innerHTML = `
            <a href="${card.left.href || "#"}">
              <img src="${escapeHtml(card.left.src)}" class="rounded-circle" alt="${escapeHtml(card.left.alt || "image")}">
            </a>`
        } else if (card.left?.type === "icon") {
          left.classList.add("icn-wrap")
          left.innerHTML = `<i class="${escapeHtml(card.left.className || "far fa-bookmark")}"></i>`
        } else {
          left.innerHTML = ""
        }
      }

      if (labelLink) {
        labelLink.textContent = card.label ?? ""
        labelLink.href = card.href || "#"
      }
      if (value) value.textContent = card.value ?? ""

      wrap.appendChild(node)
    })
  }

  function renderStars(rating, max = 5) {
    const ul = $("#js-rating-stars")
    if (!ul) return
    ul.innerHTML = ""

    const r = Math.max(0, Math.min(max, Number(rating || 0)))
    for (let i = 1; i <= max; i++) {
      const li = document.createElement("li")
      li.innerHTML = `<span class="fas fa-star"><span class="sr-only">star</span></span>`
      // istersen boş yıldız da yaparsın, ama template zaten dolu yıldız kullanıyor
      // basit kalsın: rating 3 ise ilk 3 dolu, diğerleri boş
      if (i > r) li.innerHTML = `<span class="far fa-star"><span class="sr-only">star</span></span>`
      ul.appendChild(li)
    }
  }

  function renderHeroImage(img) {
    const wrap = $("#js-hero-image-wrap")
    if (!wrap) return
    wrap.innerHTML = ""

    if (!img?.src) return

    wrap.innerHTML = `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || "image")}">`
  }

  function renderLearnList(items) {
    const ul = $("#js-learn-list")
    if (!ul) return
    ul.innerHTML = ""

    ;(items || []).forEach(it => {
      const li = document.createElement("li")
      li.textContent = it
      ul.appendChild(li)
    })
  }

  function renderCurriculum(sections) {
    const root = $("#js-curriculum")
    const tplSec = $("#tpl-curriculum-section")
    const tplItem = $("#tpl-curriculum-item")
    if (!root || !tplSec || !tplItem) return

    root.innerHTML = ""

    ;(sections || []).forEach((sec, secIndex) => {
      const secNode = tplSec.content.cloneNode(true)
      const secTitle = secNode.querySelector('[data-role="sectionTitle"]')
      const accordion = secNode.querySelector('[data-role="accordion"]')

      const accordionId = `accordion_${secIndex + 1}`
      if (accordion) accordion.id = accordionId

      if (secTitle) {
        // ör: "Section-1: Introduction" gibi
        secTitle.textContent = sec.title || `Section-${secIndex + 1}`
      }

      // items
      ;(sec.items || []).forEach((item, itemIndex) => {
        const itemNode = tplItem.content.cloneNode(true)

        const heading = itemNode.querySelector('[data-role="heading"]')
        const a = itemNode.querySelector("a.accOpener")
        const collapse = itemNode.querySelector('[data-role="collapse"]')

        const leftCol = itemNode.querySelector('[data-role="leftCol"]')
        const rightCol = itemNode.querySelector('[data-role="rightCol"]')
        const body = itemNode.querySelector('[data-role="body"]')

        const headingId = `heading_${secIndex + 1}_${itemIndex + 1}`
        const collapseId = `collapse_${secIndex + 1}_${itemIndex + 1}`

        if (heading) heading.id = headingId
        if (collapse) {
          collapse.id = collapseId
          collapse.setAttribute("aria-labelledby", headingId)

          // default açık gelsin mi?
          if (item.open === true) {
            collapse.classList.add("in")
            if (a) a.setAttribute("aria-expanded", "true")
          }
        }

        if (a) {
          a.setAttribute("data-parent", `#${accordionId}`)
          a.setAttribute("href", `#${collapseId}`)
          a.setAttribute("aria-controls", collapseId)
        }

        // Sol metin: ikon + başlık + label
        const iconClass = item.iconClass || "fas fa-play-circle inlineIcn"
        const leadIcon = item.leadIconClass || "fas fa-chevron-circle-right accOpenerIcn"

        const labelHtml = item.badge?.text ? ` <span class="label ${escapeHtml(item.badge.className || "label-primary")} text-white text-uppercase">${escapeHtml(item.badge.text)}</span>` : ""

        if (leftCol) {
          leftCol.innerHTML = `
            <i class="${escapeHtml(leadIcon)}"></i>
            <i class="${escapeHtml(iconClass)}"></i>
            ${escapeHtml(item.title || "")}
            ${labelHtml}
          `.trim()
        }

        // Sağ metin: preview tag + süre
        if (rightCol) {
          const preview = item.previewTag ? `<span class="tagText bg-primary fw-semi text-white text-uppercase">${escapeHtml(item.previewTag)}</span>` : ""
          const duration = item.duration ? `<time datetime="${escapeHtml(item.datetime || "2011-01-12")}" class="timeCount">${escapeHtml(item.duration)}</time>` : ""
          rightCol.innerHTML = `${preview}${duration}`
        }

        // Body: string/array/html destek
        if (body) renderRich(body, item.body)

        accordion?.appendChild(itemNode)
      })

      root.appendChild(secNode)
    })
  }

  function renderBookmarkFoot(bookmark) {
    const el = $("#js-bookmark-foot")
    if (!el) return

    if (bookmark?.enabled === false) {
      el.innerHTML = ""
      return
    }

    const socials = (bookmark?.socials || [])
      .map(s => {
        return `<li><a href="${escapeHtml(s.href || "#")}" class="${escapeHtml(s.className || "")}"><span class="${escapeHtml(s.iconClass || "")}"></span></a></li>`
      })
      .join("")

    el.innerHTML = `
      <div class="bookmarkCol">
        <ul class="socail-networks list-unstyled">${socials}</ul>
      </div>
      <div class="bookmarkCol text-right">
        <a href="${escapeHtml(bookmark?.button?.href || "#")}"
           class="btn btn-theme btn-warning text-uppercase fw-bold">
           ${escapeHtml(bookmark?.button?.text || "Bookmark this course")}
        </a>
      </div>
    `
  }

  function renderInstructor(ins) {
    const box = $("#js-instructor-box")
    if (!box) return

    if (!ins || ins.enabled === false) {
      box.innerHTML = ""
      return
    }

    box.innerHTML = `
      <div class="alignleft">
        <a href="${escapeHtml(ins.profileHref || "instructor-single.html")}">
          <img src="${escapeHtml(ins.avatar || "")}" alt="${escapeHtml(ins.name || "Instructor")}">
        </a>
      </div>
      <div class="description-wrap">
        <h3 class="fw-normal"><a href="${escapeHtml(ins.profileHref || "instructor-single.html")}">${escapeHtml(ins.name || "")}</a></h3>
        <h4 class="fw-normal">${escapeHtml(ins.title || "")}</h4>
        <p>${escapeHtml(ins.bio || "")}</p>
        ${
          ins.button?.enabled === false
            ? ""
            : `
          <a href="${escapeHtml(ins.button?.href || "#")}" class="btn btn-default font-lato fw-semi text-uppercase">
            ${escapeHtml(ins.button?.text || "View Profile")}
          </a>
        `
        }
      </div>
    `
  }

  function renderReviews(reviews) {
    const subtitle = $("#js-reviews-subtitle")
    const list = $("#js-reviews-list")
    if (!list) return

    list.innerHTML = ""

    const count = (reviews || []).length
    if (subtitle) subtitle.textContent = `There are ${count} reviews on this course`

    ;(reviews || []).forEach(r => {
      const li = document.createElement("li")
      const stars = Array.from({ length: 5 })
        .map((_, i) => {
          const filled = i + 1 <= (r.stars || 0)
          return `<li><span class="${filled ? "fas" : "far"} fa-star"><span class="sr-only">star</span></span></li>`
        })
        .join("")

      li.innerHTML = `
        <div class="alignleft">
          <a href="${escapeHtml(r.profileHref || "instructor-single.html")}">
            <img src="${escapeHtml(r.avatar || "")}" alt="${escapeHtml(r.name || "Reviewer")}">
          </a>
        </div>
        <div class="description-wrap">
          <div class="descrHead">
            <h3>${escapeHtml(r.name || "")} – <time datetime="${escapeHtml(r.datetime || "2011-01-12")}">${escapeHtml(r.dateText || "")}</time></h3>
            <ul class="star-rating list-unstyled justify-end">${stars}</ul>
          </div>
          <p>${escapeHtml(r.text || "")}</p>
        </div>
      `
      list.appendChild(li)
    })
  }

  function renderSidebar(sb) {
    const root = $("#js-sidebar")
    if (!root) return

    // sidebar’ı JSON’da string html ile tamamen özgür de yapabilirsin
    if (sb?.html) {
      root.innerHTML = String(sb.html)
      return
    }

    // yoksa parçalı kurulum
    const widgets = []

    if (sb?.takeCourse?.enabled !== false) {
      const tc = sb.takeCourse || {}
      widgets.push(`
        <section class="widget widget_box widget_course_select">
          <header class="widgetHead text-center bg-theme">
            <h3 class="text-uppercase">${escapeHtml(tc.title || "Take This Course")}</h3>
          </header>
          <strong class="price element-block font-lato" data-label="price:">${escapeHtml(tc.price || "")}</strong>
          <ul class="list-unstyled font-lato">
            ${(tc.features || []).map(f => `<li><i class="${escapeHtml(f.iconClass || "far fa-dot-circle")} icn no-shrink"></i> ${escapeHtml(f.text || "")}</li>`).join("")}
          </ul>
        </section>
      `)
    }

    if (sb?.categories?.enabled !== false) {
      const c = sb.categories || {}
      widgets.push(`
        <section class="widget widget_categories">
          <h3>${escapeHtml(c.title || "Course Categories")}</h3>
          <ul class="list-unstyled text-capitalize font-lato">
            ${(c.items || [])
              .map(
                it => `
              <li class="cat-item ${it.active ? "active" : ""}">
                <a href="${escapeHtml(it.href || "#")}">${escapeHtml(it.label || "")}</a>
              </li>
            `,
              )
              .join("")}
          </ul>
        </section>
      `)
    }

    if (sb?.intro?.enabled !== false) {
      const i = sb.intro || {}
      widgets.push(`
        <section class="widget widget_intro">
          <h3>${escapeHtml(i.title || "Course Intro")}</h3>
          <div class="aligncenter overlay">
            ${i.videoHref ? `<a href="${escapeHtml(i.videoHref)}" class="btn-play far fa-play-circle lightbox fancybox.iframe"></a>` : ""}
            ${i.image ? `<img src="${escapeHtml(i.image)}" alt="${escapeHtml(i.alt || "image")}">` : ""}
          </div>
        </section>
      `)
    }

    if (sb?.popularCourses?.enabled !== false) {
      const p = sb.popularCourses || {}
      widgets.push(`
        <section class="widget widget_popular_posts">
          <h3>${escapeHtml(p.title || "Popular Courses")}</h3>
          <ul class="widget-cources-list list-unstyled">
            ${(p.items || [])
              .map(
                it => `
              <li>
                <a href="${escapeHtml(it.href || "#")}">
                  <div class="alignleft">
                    <img src="${escapeHtml(it.image || "")}" alt="${escapeHtml(it.alt || "image")}">
                  </div>
                  <div class="description-wrap">
                    <h4>${escapeHtml(it.title || "")}</h4>
                    <strong class="price ${escapeHtml(it.priceClass || "text-primary")} element-block font-lato text-uppercase">
                      ${escapeHtml(it.price || "")}
                    </strong>
                  </div>
                </a>
              </li>
            `,
              )
              .join("")}
          </ul>
        </section>
      `)
    }

    if (sb?.tags?.enabled !== false) {
      const t = sb.tags || {}
      widgets.push(`
        <nav class="widget widget_tags">
          <h3>${escapeHtml(t.title || "Tags")}</h3>
          <ul class="list-unstyled tag-clouds font-lato">
            ${(t.items || []).map(it => `<li><a href="${escapeHtml(it.href || "#")}">${escapeHtml(it.label || "")}</a></li>`).join("")}
          </ul>
        </nav>
      `)
    }

    root.innerHTML = widgets.join("")
  }

  async function init() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" })
      if (!res.ok) throw new Error(`JSON load failed: ${res.status}`)
      const raw = await res.json()

      // backward compatible: if JSON already contains course property, use it directly
      let data = raw
      if (!raw) throw new Error("Empty JSON")
      if (!raw.course || typeof raw.course === "undefined") {
        // raw is a map of types, choose by ?type=KEY or raw.default or first key
        const params = new URLSearchParams(window.location.search)
        const typeKey = params.get("type") || raw.default || Object.keys(raw).find(k => k !== "default")
        if (typeKey && raw[typeKey]) data = raw[typeKey]
      }

      // HERO
      const hero = $("#js-hero")
      setBgImage(hero, data.hero?.backgroundImage)
      const heroTitle = $("#js-hero-title")
      if (heroTitle) heroTitle.textContent = data.hero?.title || ""

      // Breadcrumb
      renderBreadcrumb(data.breadcrumb)

      // Course title
      const courseTitle = $("#js-course-title")
      if (courseTitle) courseTitle.textContent = data.course?.title || ""

      // Meta cards (Instructor/Category vb.)
      renderMetaCards(data.course?.metaCards)

      // Rating
      renderStars(data.course?.rating?.stars, 5)
      const reviewsEl = $("#js-rating-reviews")
      if (reviewsEl) reviewsEl.textContent = data.course?.rating?.reviewsText || ""

      // Hero image
      renderHeroImage(data.course?.mainImage)

      // Description blocks
      const descTitle = $("#js-desc-title")
      if (descTitle) descTitle.textContent = data.course?.descriptionTitle || "Course Description"
      renderRich($("#js-description"), data.course?.description)

      // Learn blocks
      const learnTitle = $("#js-learn-title")
      if (learnTitle) learnTitle.textContent = data.course?.learnTitle || "What you will learn"
      renderRich($("#js-learn-intro"), data.course?.learnIntro)
      renderLearnList(data.course?.learnList || [])
      renderRich($("#js-after-learn"), data.course?.afterLearn)

      // Curriculum (7 section olacak demiştin)
      const curTitle = $("#js-curriculum-title")
      if (curTitle) curTitle.textContent = data.course?.curriculumTitle || "Curriculum"
      renderCurriculum(data.course?.curriculumSections || [])

      // Bookmark
      renderBookmarkFoot(data.course?.bookmark)

      // Instructor
      const insTitle = $("#js-instructor-title")
      if (insTitle) insTitle.textContent = data.instructor?.sectionTitle || "About Instructor"
      renderInstructor(data.instructor)

      // Reviews
      const revTitle = $("#js-reviews-title")
      if (revTitle) revTitle.textContent = data.reviews?.sectionTitle || "Reviews"
      renderReviews(data.reviews?.items || [])

      // Review form show/hide
      const form = $("#js-review-form")
      if (form && data.reviews?.formEnabled === false) form.style.display = "none"

      // Sidebar
      renderSidebar(data.sidebar)
    } catch (err) {
      // Üretimde bunu console’a bırak, UI bozma
      console.error(err)
    }
  }

  document.addEventListener("DOMContentLoaded", init)
})()
