document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const mainContent = document.querySelector('.main-content');
    const profileView = document.getElementById('profile-view');
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    // Elementos do perfil
    const profilePanel = document.getElementById('profile-header-panel');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const createProductBtn = document.getElementById('create-product-btn');
    // Elementos de visualização
    const profileViewPic = document.getElementById('profile-view-pic');
    const profileViewBanner = document.getElementById('profile-banner-div');
    const profileViewUsername = document.getElementById('profile-view-username');
    const profileViewBio = document.getElementById('profile-view-bio');
    // Elementos de edição
    const editUsernameInput = document.getElementById('edit-username-input');
    const editBioTextarea = document.getElementById('edit-bio-textarea');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editBannerOverlay = document.getElementById('edit-banner-overlay');
    const editPicOverlay = document.getElementById('edit-pic-overlay');
    // Novos elementos de upload
    const profilePicUploader = document.getElementById('profile-pic-uploader');
    const bannerUploader = document.getElementById('banner-uploader');


    // --- FUNÇÕES GLOBAIS DE AUTENTICAÇÃO ---
    const profileColors = [ '#A742FF', '#00D1FF', '#FF4F8B', '#2DE8A5', '#F45B69', '#3D52D5', '#00A9A5', '#7A431D', '#5E5D5C', '#E53935', '#1E88E5' ];

    function getDeterministicColorForUser(username) {
        if (!username) return profileColors[0];
        let sum = 0;
        for (let i = 0; i < username.length; i++) { sum += username.charCodeAt(i); }
        return profileColors[sum % profileColors.length];
    }

    function saveUser(userData) { localStorage.setItem('hyperiumUser', JSON.stringify(userData)); }
    function getUser() { const user = localStorage.getItem('hyperiumUser'); return user ? JSON.parse(user) : null; }
    function logoutUser() { localStorage.removeItem('hyperiumUser'); window.location.href = 'index.html'; }

    // --- LÓGICA DE UPLOAD ---

    function handleImagePreview(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'profile-pic') {
                profileViewPic.src = e.target.result;
            } else if (type === 'banner') {
                profileViewBanner.style.backgroundImage = `url('${e.target.result}')`;
            }
        };
        reader.readAsDataURL(file);
    }

    async function uploadImage(file) {
        if (!file) return null;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Falha no upload da imagem.');
            }

            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            alert('Ocorreu um erro ao enviar a imagem. Tente novamente.');
            return null;
        }
    }


    // --- FUNÇÕES DE NAVEGAÇÃO E MODO DE EDIÇÃO ---
    function showProfileView() {
        const user = getUser();
        if (!user) return;
        mainContent.classList.add('hidden');
        profileView.classList.remove('hidden');
        populateProfileData(user);
        window.scrollTo(0, 0);
    }
    
    function populateProfileData(user) {
        profileViewUsername.textContent = user.name;
        profileViewBio.textContent = user.bio || "Esta é a minha bio. Fale um pouco sobre você!";
        profileViewPic.src = user.profilePicUrl || 'assets/images/profile.png';
        profileViewBanner.style.backgroundImage = user.bannerUrl ? `url('${user.bannerUrl}')` : 'none';
        
        const profilePicContainer = document.querySelector('.profile-pic-large');
        if (profilePicContainer) {
            profilePicContainer.style.backgroundColor = user.bgColor;
        }
        
        if(getUser()){
            editProfileBtn.classList.remove('hidden');
            createProductBtn.classList.remove('hidden');
        }
    }

    function showMainContent() {
        mainContent.classList.remove('hidden');
        profileView.classList.add('hidden');
    }

    function enterEditMode() {
        const user = getUser();
        if (!user) return;
        
        profilePanel.classList.add('edit-mode');
        editUsernameInput.value = user.name;
        editBioTextarea.value = user.bio || '';
        
        editBannerOverlay.classList.remove('hidden');
        editPicOverlay.classList.remove('hidden');
    }

    async function exitEditMode(shouldSave) {
        if (shouldSave) {
            const user = getUser();
            if (!user) return;

            saveEditBtn.textContent = 'Salvando...';
            saveEditBtn.disabled = true;

            const newPicFile = profilePicUploader.files[0];
            const newBannerFile = bannerUploader.files[0];

            const newPicUrl = await uploadImage(newPicFile);
            const newBannerUrl = await uploadImage(newBannerFile);

            user.name = editUsernameInput.value.trim() || user.name;
            user.bio = editBioTextarea.value.trim();
            if (newPicUrl) user.profilePicUrl = newPicUrl;
            if (newBannerUrl) user.bannerUrl = newBannerUrl;
            
            saveUser(user);
            populateProfileData(user);
            updateUIToLoggedIn(user);
            
            profilePicUploader.value = '';
            bannerUploader.value = '';
            
            alert("Perfil salvo com sucesso!");
            
            saveEditBtn.textContent = 'Salvar';
            saveEditBtn.disabled = false;

        } else {
            const user = getUser();
            populateProfileData(user);
        }
        
        profilePanel.classList.remove('edit-mode');
        editBannerOverlay.classList.add('hidden');
        editPicOverlay.classList.add('hidden');
    }

    function updateUIToLoggedIn(user) {
        document.querySelectorAll('.auth-btn, .mobile-auth-icon, .mobile-nav-login').forEach(el => el?.classList.add('hidden'));
        
        const desktopProfileDropdown = document.querySelector('.profile-dropdown');
        const headerMobileProfile = document.querySelector('.user-profile-header-mobile');
        const sidebarProfile = document.querySelector('.sidebar-user-profile');
        const mobileLogoutLink = document.getElementById('mobile-logout-li');
        
        if (desktopProfileDropdown) { desktopProfileDropdown.classList.remove('hidden'); document.getElementById('desktop-username').textContent = user.name; }
        if (headerMobileProfile) { headerMobileProfile.classList.remove('hidden'); }
        if (sidebarProfile) { sidebarProfile.classList.remove('hidden'); document.getElementById('sidebar-username').textContent = user.name; }
        if (mobileLogoutLink) { mobileLogoutLink.classList.remove('hidden'); }

        document.querySelectorAll('.profile-pic').forEach(el => {
            el.style.setProperty('--profile-bg-color', user.bgColor);
            const img = el.querySelector('img');
            if (img) {
                img.src = user.profilePicUrl || 'assets/images/profile.png';
            }
        });

        document.querySelectorAll('.logout-link').forEach(button => {
            button.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });
        });

        document.querySelectorAll('.view-profile-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showProfileView();
                if(sidebar && sidebar.classList.contains('is-open')) {
                    toggleSidebar();
                }
            });
        });
    }

    // --- LÓGICA PRINCIPAL E EVENT LISTENERS ---
    const loggedInUser = getUser();
    if (loggedInUser) {
        updateUIToLoggedIn(loggedInUser);
    }
    
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.mobile-nav-sidebar');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const toggleSidebar = () => {
        if (!sidebar || !overlay) return;
        const isOpen = sidebar.classList.toggle('is-open');
        overlay.classList.toggle('is-open');
        document.body.classList.toggle('body-no-scroll', isOpen);
    };

    document.querySelectorAll('.go-home-link').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); showMainContent(); if(sidebar && sidebar.classList.contains('is-open')) { toggleSidebar(); } });
    });

    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', (e) => { e.preventDefault(); showMainContent(); });
    }
    
    if (editProfileBtn) editProfileBtn.addEventListener('click', (e) => { e.preventDefault(); enterEditMode(); });
    if (saveEditBtn) saveEditBtn.addEventListener('click', () => exitEditMode(true));
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => exitEditMode(false));
    
    if(editPicOverlay) editPicOverlay.addEventListener('click', () => profilePicUploader.click());
    if(editBannerOverlay) editBannerOverlay.addEventListener('click', () => bannerUploader.click());

    if(profilePicUploader) profilePicUploader.addEventListener('change', (e) => handleImagePreview(e, 'profile-pic'));
    if(bannerUploader) bannerUploader.addEventListener('change', (e) => handleImagePreview(e, 'banner'));
    
    if (hamburger) hamburger.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    document.querySelectorAll('.accordion-item').forEach(item => {
        const toggle = item.querySelector('.accordion-toggle');
        const content = item.querySelector('.accordion-content');
        if(toggle && content){
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = item.classList.toggle('open');
                content.style.maxHeight = isOpen ? content.scrollHeight + 'px' : '0px';
            });
        }
    });

    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm && signupForm) {
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');
        switchToSignup.addEventListener('click', (e) => { e.preventDefault(); loginForm.classList.remove('active'); signupForm.classList.add('active'); });
        switchToLogin.addEventListener('click', (e) => { e.preventDefault(); signupForm.classList.remove('active'); loginForm.classList.add('active'); });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            if (password !== confirmPassword) {
                alert('As senhas não coincidem. Por favor, tente novamente.'); return;
            }
            const usernameInput = document.getElementById('signup-name');
            const username = usernameInput.value.trim();
            const user = { name: username, bgColor: getDeterministicColorForUser(username), bio: '', profilePicUrl: '', bannerUrl: '' };
            saveUser(user);
            alert(`Conta para "${user.name}" criada com sucesso! Bem-vindo ao Hyperium.`);
            window.location.href = 'index.html';
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            let username = emailInput.value.split('@')[0].trim() || "Visitante";
            let user = { name: username, bgColor: getDeterministicColorForUser(username), bio: '', profilePicUrl: '', bannerUrl: '' };
            saveUser(user);
            alert(`Bem-vindo de volta, ${username}!`);
            window.location.href = 'index.html';
        });
    }
});