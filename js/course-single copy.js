fetch("data/course-types.json")
  .then(response => response.json())
  .then(data => {
    //heading banner içeriği
    document.getElementById("headingBg").style.backgroundImage = data.heading.backgroundImage
    document.getElementById("headingTitle").textContent = data.heading.title

    const container = document.getElementById("template")
    //breadcrumb  içeriği
  const {listItems} = data.breadcrumb
  const breadCrumb = document.getElementById("js-breadcrumb")
  breadCrumb.innerHTML = ""
  listItems.forEach(item => {
    const li = document.createElement("li")
    li.textContent = item
    breadCrumb.appendChild(li)
    listItems.lastIndexOf(item) === listItems.length - 1 ? li.classList.add("active") : null
  })

  //head içeriği
  const img = document.createElement('img')
 
  

  document.getElementById("js-hero-image-wrap").src = data.teacherArea.portrait
  document.getElementById("js-course-title").textContent = data.head
  document.getElementById("js-hero-teacher-title").textContent = data.teacherArea.teacherTitle
  document.getElementById("js-hero-teacher-name").textContent = data.teacherArea.teacherName
  document.getElementById("js-hero-educationCat").textContent = data.teacherArea.educationCat
  
  
  
  //ilk açıklama paragrafı
  
  document.getElementById("js-desc-img").src = data.educationArea.image

  const { desc1, desc2, desc3, desc4 } = data.educationArea

  function renderContent(desc1, container) {
    desc1.forEach(item => {
      const element = document.createElement(item.type)

      if (item.class) {
        element.className = item.class
      }

      if (item.text) {
        element.textContent = item.text
      }

      if (item.items) {
        item.items.forEach(liText => {
          const li = document.createElement("li")
          li.textContent = liText
          element.appendChild(li)
        })
      }

      container.appendChild(element)
    })
  }
renderContent(desc1, container)



  
 
   
 

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  })
  .catch(error => {
    console.error("Hata:", error)
  })
