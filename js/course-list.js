const educationCount = document.getElementById("educationCount")
const ul = document.getElementById('pagination')


fetch('./data/courses.json').then(res => res.json()).then(data => {
        const courseCount = {...data}
        
          let count = courseCount.courses.length
          if(count < 9){
              educationCount.textContent = `${count} Eğitimden tamamı listeleniyor`
            } else
            educationCount.textContent = `${count} Eğitimden 9'u listeleniyor`

       
            
    });
