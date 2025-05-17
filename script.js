// Tüm DOM öğelerini al
const takvimGunler = document.getElementById("takvimGunler");
const seciliTarih = document.getElementById("seciliTarih");
const takvimBaslik = document.getElementById("takvimBaslik");

let secilenTarih = null;
let aktifTarih = new Date();
let aktifYil = aktifTarih.getFullYear();
let aktifAy = aktifTarih.getMonth();

const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function takvimiOlustur() {
  takvimGunler.innerHTML = "";
  takvimBaslik.textContent = `${aylar[aktifAy]} ${aktifYil}`;

  const gunSayisi = new Date(aktifYil, aktifAy + 1, 0).getDate();
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);

  for (let i = 1; i <= gunSayisi; i++) {
    const buGunTarih = new Date(aktifYil, aktifAy, i);
    buGunTarih.setHours(0, 0, 0, 0);
    if (buGunTarih < bugun) continue;

    const gun = document.createElement("div");
    gun.textContent = i;
    gun.classList.add("gun");

    gun.onclick = () => {
      secilenTarih = `${aktifYil}-${String(aktifAy + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      seciliTarih.textContent = `Seçilen Tarih: ${secilenTarih}`;
      document.querySelectorAll(".gun").forEach(g => g.classList.remove("secili"));
      gun.classList.add("secili");
    };

    takvimGunler.appendChild(gun);
  }
}

document.getElementById("oncekiAy").onclick = () => {
  const bugun = new Date();
  const bugunYil = bugun.getFullYear();
  const bugunAy = bugun.getMonth();

  if (aktifYil === bugunYil && aktifAy === bugunAy) return;

  aktifAy--;
  if (aktifAy < 0) {
    aktifAy = 11;
    aktifYil--;
  }

  if (aktifYil < bugunYil || (aktifYil === bugunYil && aktifAy < bugunAy)) {
    aktifYil = bugunYil;
    aktifAy = bugunAy;
  }

  takvimiOlustur();
};

document.getElementById("sonrakiAy").onclick = () => {
  aktifAy++;
  if (aktifAy > 11) {
    aktifAy = 0;
    aktifYil++;
  }
  takvimiOlustur();
};

takvimiOlustur();

function ileri(adim) {
  if (adim === 1 && !secilenTarih) {
    alert("Lütfen bir tarih seçin.");
    return;
  }

  if (adim === 3) {
    const ad = document.getElementById("ad").value;
    const kisi = document.getElementById("kisi").value;
    const telefon = document.getElementById("telefon").value;
    const email = document.getElementById("email").value;
    if (!ad.trim() || !kisi || !telefon.trim() || !email.trim()) {
      alert("Lütfen tüm bilgileri doldurun.");
      return;
    }
  }

  document.querySelector(`#step-${adim}`).classList.remove("active");
  document.querySelector(`#step-${adim + 1}`).classList.add("active");
  guncelleStepIndicator(adim + 1);

  if (adim + 1 === 4) {
    tamamla();
  }
}

function guncelleStepIndicator(aktifAdim) {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === aktifAdim - 1);
  });
}

function tamamla() {
  const saat = document.getElementById("saat").value;
  const ad = document.getElementById("ad").value;
  const kisi = document.getElementById("kisi").value;
  const telefon = document.getElementById("telefon").value;
  const email = document.getElementById("email").value;
  const rezervasyon = { tarih: secilenTarih, saat, ad, kisi, telefon, email,};
  let kayitlar = JSON.parse(localStorage.getItem("rezervasyonlar")) || [];
  kayitlar.push(rezervasyon);
  localStorage.setItem("rezervasyonlar", JSON.stringify(kayitlar));

  const ozetHTML = `
    <p><strong>Tarih:</strong> ${secilenTarih}</p>
    <p><strong>Saat:</strong> ${saat}</p>
    <p><strong>Ad:</strong> ${ad}</p>
    <p><strong>Kişi Sayısı:</strong> ${kisi}</p>
    <p><strong>Telefon:</strong> ${telefon}</p>
    <p><strong>E-posta:</strong> ${email}</p>
    <p style="color: green; font-weight: bold; margin-top: 20px;">✅ Rezervasyon Onaylandı</p>
  `;

  document.getElementById("ozet").innerHTML = ozetHTML;

  document.getElementById("mesaj").innerHTML = `
    <br>Rezervasyon başarıyla oluşturuldu!<br><br>
    <button onclick="yenidenBasla()">Yeni rezervasyon yap</button>
  `;
}

function yenidenBasla() {
  document.querySelectorAll(".step-content").forEach(el => el.classList.remove("active"));
  document.querySelector("#step-1").classList.add("active");

  document.querySelectorAll(".step").forEach(el => el.classList.remove("active"));
  document.querySelector(".step").classList.add("active");

  document.getElementById("ad").value = "";
  document.getElementById("kisi").value = "";
  document.getElementById("telefon").value = "";
  document.getElementById("email").value = "";
  document.getElementById("seciliTarih").textContent = "";
  secilenTarih = null;

  document.querySelectorAll(".gun").forEach(g => g.classList.remove("secili"));
  document.getElementById("mesaj").textContent = "";
  takvimiOlustur();
}
