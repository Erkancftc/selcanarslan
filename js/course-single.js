;(function () {
  const JSON_URL = "data/course-single.json"
  const root = document.getElementById("main")
  if (!root) return

  const getByPath = (obj, path) => path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)

  const setText = (el, value) => {
    if (value === undefined || value === null) return
    el.textContent = String(value)
  }

  const setAttrs = (el, attrMap, data) => {
    attrMap.split(",").forEach(pair => {
      const [attr, path] = pair.split(":").map(s => s.trim())
      if (!attr || !path) return
      const val = getByPath(data, path)
      if (val === undefined || val === null) return
      el.setAttribute(attr, String(val))
    })
  }

  const setStyleBindings = (el, styleBind, data) => {
    styleBind.split(",").forEach(pair => {
      const [prop, path] = pair.split(":").map(s => s.trim())
      if (!prop || !path) return
      const val = getByPath(data, path)
      if (!val) return
      if (prop === "backgroundImage") el.style.backgroundImage = `url(${val})`
      else el.style[prop] = val
    })
  }

  // ---- render helpers (kısa tutuyorum, önceki sürümle aynı mantık) ----
  const renderStars = (ul, ratingValue) => {
    const v = Math.max(0, Math.min(5, Number(ratingValue || 0)))
    ul.innerHTML = ""
    for (let i = 0; i < 5; i++) {
      const li = document.createElement("li")
      const span = document.createElement("span")
      span.className = i < v ? "fas fa-star" : "far fa-star"
      const sr = document.createElement("span")
      sr.className = "sr-only"
      sr.textContent = "star"
      span.appendChild(sr)
      li.appendChild(span)
      ul.appendChild(li)
    }
  }

  const renderBreadcrumb = (ol, items) => {
    if (!Array.isArray(items)) return
    ol.innerHTML = ""
    items.forEach(it => {
      const li = document.createElement("li")
      if (it.active) {
        li.className = "active"
        li.textContent = it.label || ""
      } else {
        const a = document.createElement("a")
        a.href = it.href || "#"
        a.textContent = it.label || ""
        li.appendChild(a)
      }
      ol.appendChild(li)
    })
  }

  const renderParagraphs = (container, paragraphs) => {
    if (!Array.isArray(paragraphs)) return
    container.innerHTML = ""
    paragraphs.forEach(t => {
      const p = document.createElement("p")
      p.textContent = t
      container.appendChild(p)
    })
  }

  const renderBullets = (ul, bullets) => {
    if (!Array.isArray(bullets)) return
    ul.innerHTML = ""
    bullets.forEach(t => {
      const li = document.createElement("li")
      li.textContent = t
      ul.appendChild(li)
    })
  }

  const renderShare = (ul, items) => {
    if (!Array.isArray(items)) return
    ul.innerHTML = ""
    items.forEach(it => {
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.href = it.href || "#"
      if (it.className) a.className = it.className
      const span = document.createElement("span")
      span.className = it.icon || "fas fa-plus"
      a.appendChild(span)
      li.appendChild(a)
      ul.appendChild(li)
    })
  }

  const renderSidebarMeta = (ul, items) => {
    if (!Array.isArray(items)) return
    ul.innerHTML = ""
    items.forEach(it => {
      const li = document.createElement("li")
      const i = document.createElement("i")
      i.className = (it.icon || "") + " icn no-shrink"
      li.appendChild(i)
      li.appendChild(document.createTextNode(" " + (it.text || "")))
      ul.appendChild(li)
    })
  }

  const renderCategories = (ul, items) => {
    if (!Array.isArray(items)) return
    ul.innerHTML = ""
    items.forEach((it, idx) => {
      const li = document.createElement("li")
      li.className = `cat-item cat-item-${idx + 1}` + (it.active ? " active" : "")
      const a = document.createElement("a")
      a.href = it.href || "#"
      a.textContent = it.label || ""
      li.appendChild(a)
      ul.appendChild(li)
    })
  }

  const renderPopular = (ul, items) => {
    if (!Array.isArray(items)) return
    ul.innerHTML = ""
    items.forEach(it => {
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.href = it.href || "#"

      const left = document.createElement("div")
      left.className = "alignleft"
      const img = document.createElement("img")
      img.src = it.img || "http://placehold.it/60x60"
      img.alt = "image description"
      left.appendChild(img)

      const wrap = document.createElement("div")
      wrap.className = "description-wrap"
      const h4 = document.createElement("h4")
      h4.textContent = it.title || ""
      const price = document.createElement("strong")
      price.className = `price ${it.priceClass || "text-primary"} element-block font-lato text-uppercase`
      price.textContent = it.price || ""

      wrap.appendChild(h4)
      wrap.appendChild(price)

      a.appendChild(left)
      a.appendChild(wrap)
      li.appendChild(a)
      ul.appendChild(li)
    })
  }

  const renderTags = (ul, items) => {
    if (!Array.isArray(items)) return
    ul.innerHTML = ""
    items.forEach(it => {
      const li = document.createElement("li")
      const a = document.createElement("a")
      a.href = it.href || "#"
      a.textContent = it.label || ""
      li.appendChild(a)
      ul.appendChild(li)
    })
  }

  const renderReviews = (ul, items) => {
    if (!Array.isArray(items)) return
    ul.innerHTML = ""
    items.forEach(it => {
      const li = document.createElement("li")

      const left = document.createElement("div")
      left.className = "alignleft"
      const a1 = document.createElement("a")
      a1.href = it.link || "#"
      const img = document.createElement("img")
      img.src = it.avatar || "http://placehold.it/50x50"
      img.alt = it.name || "reviewer"
      a1.appendChild(img)
      left.appendChild(a1)

      const wrap = document.createElement("div")
      wrap.className = "description-wrap"

      const head = document.createElement("div")
      head.className = "descrHead"

      const h3 = document.createElement("h3")
      const time = document.createElement("time")
      time.setAttribute("datetime", "2011-01-12")
      time.textContent = it.date || ""
      h3.textContent = (it.name || "") + " – "
      h3.appendChild(time)

      const stars = document.createElement("ul")
      stars.className = "star-rating list-unstyled justify-end"
      renderStars(stars, it.rating || 0)

      head.appendChild(h3)
      head.appendChild(stars)

      const p = document.createElement("p")
      p.textContent = it.text || ""

      wrap.appendChild(head)
      wrap.appendChild(p)

      li.appendChild(left)
      li.appendChild(wrap)
      ul.appendChild(li)
    })
  }

  const renderCurriculum = (container, sections) => {
    if (!Array.isArray(sections)) return
    container.innerHTML = ""

    sections.forEach((sec, secIndex) => {
      const sectionEl = document.createElement("section")
      sectionEl.className = "sectionRow"

      const h2 = document.createElement("h2")
      h2.className = "h6 text-uppercase fw-semi rowHeading"
      h2.textContent = sec.title || `Section-${secIndex + 1}`
      sectionEl.appendChild(h2)

      const group = document.createElement("div")
      const accId = `accordion_dyn_${secIndex + 1}`
      group.className = "panel-group sectionRowPanelGroup"
      group.id = accId

      ;(sec.items || []).forEach((it, itemIndex) => {
        const panel = document.createElement("div")
        panel.className = "panel panel-default"

        const headingId = `heading_${secIndex}_${itemIndex}`
        const collapseId = `collapse_${secIndex}_${itemIndex}`

        const panelHead = document.createElement("div")
        panelHead.className = "panel-heading"
        panelHead.id = headingId

        const title = document.createElement("h3")
        title.className = "panel-title fw-normal"

        const a = document.createElement("a")
        a.className = "accOpener"
        a.setAttribute("data-toggle", "collapse")
        a.setAttribute("data-parent", `#${accId}`)
        a.href = `#${collapseId}`

        const col1 = document.createElement("span")
        col1.className = "accOpenerCol"

        const chevron = document.createElement("i")
        chevron.className = "fas fa-chevron-circle-right accOpenerIcn"
        const icon = document.createElement("i")
        icon.className = (it.iconClass || "far fa-file") + " inlineIcn"

        col1.appendChild(chevron)
        col1.appendChild(icon)
        col1.appendChild(document.createTextNode(" " + (it.title || "")))

        if (it.typeLabel) {
          const lbl = document.createElement("span")
          lbl.className = `label ${it.typeLabelClass || "label-primary"} text-white text-uppercase`
          lbl.textContent = it.typeLabel
          col1.appendChild(document.createTextNode(" "))
          col1.appendChild(lbl)
        }

        const col2 = document.createElement("span")
        col2.className = "accOpenerCol hd-phone"

        if (it.preview) {
          const prev = document.createElement("span")
          prev.className = "tagText bg-primary fw-semi text-white text-uppercase"
          prev.textContent = "preview"
          col2.appendChild(prev)
          col2.appendChild(document.createTextNode(" "))
        }

        const time = document.createElement("time")
        time.className = "timeCount"
        time.textContent = it.duration || ""
        col2.appendChild(time)

        a.appendChild(col1)
        a.appendChild(col2)
        title.appendChild(a)
        panelHead.appendChild(title)

        const collapse = document.createElement("div")
        collapse.id = collapseId
        collapse.className = "panel-collapse collapse"

        const body = document.createElement("div")
        body.className = "panel-body"
        const p = document.createElement("p")
        p.textContent = it.body || ""
        body.appendChild(p)
        collapse.appendChild(body)

        panel.appendChild(panelHead)
        panel.appendChild(collapse)
        group.appendChild(panel)
      })

      sectionEl.appendChild(group)
      container.appendChild(sectionEl)
    })
  }

  const applyBindings = data => {
    root.querySelectorAll("[data-bind]").forEach(el => {
      setText(el, getByPath(data, el.getAttribute("data-bind")))
    })

    root.querySelectorAll("[data-bind-attr]").forEach(el => {
      setAttrs(el, el.getAttribute("data-bind-attr"), data)
    })

    root.querySelectorAll("[data-bind-style]").forEach(el => {
      setStyleBindings(el, el.getAttribute("data-bind-style"), data)
    })

    const bc = root.querySelector('[data-render="page.breadcrumb"]')
    if (bc) renderBreadcrumb(bc, data?.page?.breadcrumb)

    const stars = root.querySelector('[data-render="course.rating.stars"]')
    if (stars) renderStars(stars, data?.course?.rating?.value)

    const desc = root.querySelector('[data-render="course.description.paragraphs"]')
    if (desc) renderParagraphs(desc, data?.course?.description?.paragraphs)

    const bullets = root.querySelector('[data-render="course.learn.bullets"]')
    if (bullets) renderBullets(bullets, data?.course?.learn?.bullets)

    const after = root.querySelector('[data-render="course.learn.afterParagraphs"]')
    if (after) renderParagraphs(after, data?.course?.learn?.afterParagraphs)

    const curriculum = root.querySelector('[data-render="course.curriculum.sections"]')
    if (curriculum) renderCurriculum(curriculum, data?.course?.curriculum?.sections)

    const share = root.querySelector('[data-render="course.share"]')
    if (share) renderShare(share, data?.course?.share)

    const reviews = root.querySelector('[data-render="course.reviews.items"]')
    if (reviews) renderReviews(reviews, data?.course?.reviews?.items)

    const meta = root.querySelector('[data-render="sidebar.takeCourse.meta"]')
    if (meta) renderSidebarMeta(meta, data?.sidebar?.takeCourse?.meta)

    const cats = root.querySelector('[data-render="sidebar.categories.items"]')
    if (cats) renderCategories(cats, data?.sidebar?.categories?.items)

    const popular = root.querySelector('[data-render="sidebar.popular.items"]')
    if (popular) renderPopular(popular, data?.sidebar?.popular?.items)

    const tags = root.querySelector('[data-render="sidebar.tags.items"]')
    if (tags) renderTags(tags, data?.sidebar?.tags?.items)
  }

  const pickCourse = allCourses => {
    const slug = new URLSearchParams(location.search).get("slug")
    if (!Array.isArray(allCourses) || allCourses.length === 0) return null

    if (!slug) return allCourses[0]

    const found = allCourses.find(c => c.slug === slug)
    return found || allCourses[0]
  }

  fetch(JSON_URL, { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("JSON okunamadı: " + r.status)
      return r.json()
    })
    .then(db => {
      const selected = pickCourse(db.courses)
      if (!selected) throw new Error("courses boş görünüyor.")
      applyBindings(selected) // ✅ burada tek kurs objesini basıyoruz
    })
    .catch(console.error)
})()
