// 1. Ambil elemen HTML yang dibutuhkan
const inputTugas = document.getElementById('input-tugas');
const btnTambah = document.getElementById('btn-tambah');
const daftarTugas = document.getElementById('daftar-tugas');

// 2. Muat data tugas yang tersimpan di LocalStorage saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', muatTugasDariStorage);

// Fungsi untuk menambah tugas baru
function tambahTugas() {
    const teksTugas = inputTugas.value.trim();

    if (teksTugas === '') {
        alert('Ketik tugasnya terlebih dahulu ya!');
        return;
    }

    // Buat elemen tampilan di HTML
    buatElemenTugas(teksTugas, false);

    // Simpan tugas baru ke LocalStorage
    simpanTugasKeStorage(teksTugas, false);

    // Kosongkan kolom input
    inputTugas.value = '';
}

// Fungsi untuk membuat elemen <li> di HTML
function buatElemenTugas(teks, statusSelesai) {
    const li = document.createElement('li');
    if (statusSelesai) {
        li.classList.add('selesai');
    }

    li.innerHTML = `
        <span class="teks-tugas">${teks}</span>
        <button class="btn-hapus">Hapus</button>
    `;

    // Event Klik: Tandai selesai (coret)
    const teksSpan = li.querySelector('.teks-tugas');
    teksSpan.addEventListener('click', function() {
        li.classList.toggle('selesai');
        updateStorage(); // Update status di storage saat dicoret
    });

    // Event Klik: Hapus tugas
    const btnHapus = li.querySelector('.btn-hapus');
    btnHapus.addEventListener('click', function() {
        li.remove();
        updateStorage(); // Update storage saat dihapus
    });

    daftarTugas.appendChild(li);
}

// -------------------------------------------------------------
// FUNGSI LOCAL STORAGE (PENYIMPANAN DATA BROWSER)
// -------------------------------------------------------------

// Simpan 1 tugas baru ke LocalStorage
function simpanTugasKeStorage(teks, status) {
    let semuaTugas = ambilTugasDariStorage();
    semuaTugas.push({ teks: teks, selesai: status });
    localStorage.setItem('daftarTugas', JSON.stringify(semuaTugas));
}

// Ambil array data dari LocalStorage
function ambilTugasDariStorage() {
    let data = localStorage.getItem('daftarTugas');
    return data ? JSON.parse(data) : [];
}

// Muat ulang daftar tugas dari LocalStorage ke layar
function muatTugasDariStorage() {
    let semuaTugas = ambilTugasDariStorage();
    semuaTugas.forEach(tugas => {
        buatElemenTugas(tugas.teks, tugas.selesai);
    });
}

// Update ulang seluruh LocalStorage jika ada yang dicoret / dihapus
function updateStorage() {
    let semuaTugas = [];
    const itemLi = daftarTugas.querySelectorAll('li');
    
    itemLi.forEach(li => {
        const teks = li.querySelector('.teks-tugas').innerText;
        const selesai = li.classList.contains('selesai');
        semuaTugas.push({ teks: teks, selesai: selesai });
    });

    localStorage.setItem('daftarTugas', JSON.stringify(semuaTugas));
}

// Event Listener tombol Tambah & tombol Enter
btnTambah.addEventListener('click', tambahTugas);
inputTugas.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        tambahTugas();
    }
});
