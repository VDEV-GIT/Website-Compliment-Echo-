document.getElementById('complimentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const compliment = e.target.compliment.value;

    await fetch('/api/compliments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compliment })
    });

    e.target.reset();
    alert('Complimentje is ip boane!');
    getCompliment();
  });


  async function getCompliment() {
    const res = await fetch('/api/random-compliment');
    const data = await res.json();
    const responseText= "ier ister complimentje vo jon were : <br><br> "
    const flagButton = `<br><button class="button-report" onclick="flagCompliment(${data.id})">Da zyn gin maniern </button>`;
    document.getElementById('response').innerHTML = (responseText + data.compliment + flagButton) || 'Geen complimentje aanwezig!';

    // removes the form from being shown
    
    document.getElementById("complimentForm").style.display = "none";
    
    
   // adds a button after submitting
    document.getElementById("resendButtonContainer").innerHTML = `<button onclick="showForm()">nog jintje</button>`;
  }
  
  function showForm() {
  document.getElementById("complimentForm").style.display = "block";
  
  document.getElementById("resendButtonContainer").innerHTML = "";
  
  }


  
    async function flagCompliment(id) {
      console.log("Flagging compliment ID:", id); // Confirm it's working
     const res = await fetch(`/api/compliments/${id}/flag`, {
      method: 'POST'
      });
      console.log(id);
      if (res.ok) {
        alert("🚩 Dat complimentje ije niet geern.");
      } else {
      alert("⚠️ Tis mislukt. ge goat later ip nieuw moetn proberen.");
      }
}



  // Starfield animation
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const stars = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
      ctx.fill();
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });