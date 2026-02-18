fetch("data/course-single.json")
  .then(response => response.json())
  .then(data => {
    //heading banner içeriği
    document.getElementById("headingBg").style.backgroundImage = data.heading.backgroundImage
    document.getElementById("headingTitle").textContent = data.heading.title

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
  const dataContent = data.content
  document.getElementById("courseTitle").textContent = dataContent.mainTitle

  //eğitmen image ve isim
const { src, alt } = dataContent.viewHeader.author.image

const img = document.getElementById("vhAuthorImg")
img.src = src
img.alt = alt

const vhAuthorLabel = document.getElementById("vhAuthorLabel")
const vhAuthorName = document.getElementById("vhAuthorName")
vhAuthorLabel.textContent = dataContent.viewHeader.author.label
vhAuthorName.textContent = dataContent.viewHeader.author.name

const vhCategoryValue = document.getElementById("vhCategoryValue")
vhCategoryValue.textContent = dataContent.viewHeader.category.value

const { vhStars, totalReviews } = dataContent.viewHeader.rating

// kaç yıldız olacağı hesaplanacak

 document.getElementById("vhReviewCount").textContent = `(${totalReviews} Yorum)`

 const courseHeroImg = document.getElementById("courseHeroImg")
 courseHeroImg.src = dataContent.heroImage.src
 courseHeroImg.alt = dataContent.heroImage.alt

 //paragraf başlangıç

const courseBlocksMount = document.getElementById("courseBlocksMount")

dataContent.blocks.forEach(block => {
  const { type, level, text, intro, items } = block

  if (type === "heading" && level === 3) {
    const h3 = document.createElement("h3")
    h3.textContent = text
    h3.classList.add("content-h3")
    courseBlocksMount.appendChild(h3)
  } else if (type === "heading" && level === 2) {
    const h2 = document.createElement("h2")
    h2.textContent = text
    h2.classList.add("content-h2")
    courseBlocksMount.appendChild(h2)
  }

  if(type === "paragraph"){
    const p = document.createElement("p")
    p.textContent = text
    courseBlocksMount.appendChild(p)
  }
  if (type === "list") {
    // optional introductory text before the list
    if (intro) {
      const introP = document.createElement("p");
      introP.textContent = intro;
      courseBlocksMount.appendChild(introP);
    }

    const ul = document.createElement("ul")
    ul.classList.add("listDefault", "list-unstyled")
    // create an <li> for each item and append to the <ul>
    items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });

    courseBlocksMount.appendChild(ul);
  }
 

})
  
  
  

 
   
 

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  })
  .catch(error => {
    console.error("Hata:", error)
  })
