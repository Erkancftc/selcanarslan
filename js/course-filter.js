const courseList = document.getElementById("courseList")
const coursePrice = document.getElementById("coursePrice")

fetch("./data/courses.json")
  .then(res => res.json())
  .then(data => {
    const courseListArray = data.courses

    // önce temizle + placeholder
    courseList.innerHTML = `<option value="">Kurs Seç</option>`
    coursePrice.innerHTML = `<option value="">Fiyat</option>`

    // optionları bas
    courseListArray.forEach(c => {
      const opt = document.createElement("option")
      opt.value = c.page.id // ✅ eşleşme için şart
      opt.textContent = c.heading.title
      courseList.appendChild(opt)
    })

    // ✅ en sonda update
    $("#courseList").trigger("chosen:updated")
    $("#coursePrice").trigger("chosen:updated")
  })
