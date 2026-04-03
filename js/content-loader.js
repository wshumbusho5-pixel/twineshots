// Content Loader - Fetches content from Supabase and renders it on the page
// Each function targets specific container elements by ID

document.addEventListener('DOMContentLoaded', async () => {
  // Only load content if Supabase is configured
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.log('Supabase not configured. Using placeholder content.');
    return;
  }

  // Load based on what containers exist on the page
  if (document.getElementById('hero-slider')) await loadHeroSlides();
  if (document.getElementById('services-grid')) await loadServices();
  if (document.getElementById('team-grid')) await loadTeamMembers();
  if (document.getElementById('gallery-grid')) await loadGalleryItems();
  if (document.getElementById('reviews-grid')) await loadReviews();
  if (document.getElementById('partners-grid')) await loadPartners();
  if (document.getElementById('values-grid')) await loadValues();
  if (document.getElementById('jobs-list')) await loadJobListings();
  if (document.getElementById('stats-grid')) await loadStats();
  if (document.getElementById('instagram-grid')) await loadInstagramPosts();
  if (document.getElementById('discover-grid')) await loadDiscoverCards();

  // Always try to load site settings (footer, contact info)
  await loadSiteSettings();

  // Re-initialize GSAP animations after content loads
  initScrollAnimations();

  // Attach form handlers
  attachContactForm();
  attachApplicationForm();
  attachReviewForm();
});


// ============================================================
// HERO SLIDES
// ============================================================
async function loadHeroSlides() {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('hero-slider');

    // Build slides HTML with thumbnails
    let slidesHTML = '';

    data.forEach((slide, index) => {
      const bgStyle = slide.image_url
        ? `background-image: url('${slide.image_url}');`
        : `background: linear-gradient(135deg, #1e3a8a, #172554);`;

      // Build thumbnail cards for OTHER slides
      let thumbsHTML = '';
      data.forEach((otherSlide, otherIndex) => {
        if (otherIndex === index) return; // skip current slide
        const thumbBg = otherSlide.image_url
          ? `background-image: url('${otherSlide.image_url}');`
          : `background: linear-gradient(135deg, #1e3a8a, #172554);`;

        thumbsHTML += `
          <div class="hero-thumb" data-slide="${otherIndex}">
            <div class="thumb-img" style="${thumbBg}"></div>
            <div class="thumb-text">
              <h4>${escapeHTML(otherSlide.title)}</h4>
              <p>${escapeHTML(otherSlide.description || '').substring(0, 40)}</p>
            </div>
          </div>
        `;
      });

      slidesHTML += `
        <div class="hero-slide${index === 0 ? ' active' : ''}" style="${bgStyle}">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1>${escapeHTML(slide.title)}</h1>
            ${slide.description ? `<p>${escapeHTML(slide.description)}</p>` : ''}
          </div>
          <div class="hero-thumbnails">
            ${thumbsHTML}
          </div>
        </div>
      `;
    });

    // Replace all content in the hero container
    container.innerHTML = slidesHTML;

    // Re-initialize slider JS with thumbnail support
    reinitHeroSlider();
  } catch (err) {
    console.error('Error loading hero slides:', err);
  }
}

function reinitHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  let current = 0;

  window.goToSlide = function(index) {
    if (index === current) return;
    slides[current].classList.remove('active');
    current = index;
    if (current >= slides.length) current = 0;
    if (current < 0) current = slides.length - 1;
    slides[current].classList.add('active');
  };

  // Thumbnail click handlers
  document.querySelectorAll('.hero-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const slideIndex = parseInt(thumb.getAttribute('data-slide'));
      if (!isNaN(slideIndex)) {
        window.goToSlide(slideIndex);
        // Reset auto-rotate
        clearInterval(window._heroInterval);
        window._heroInterval = setInterval(() => {
          window.goToSlide((current + 1) % slides.length);
        }, 5000);
      }
    });
  });

  // Clear any existing interval
  if (window._heroInterval) clearInterval(window._heroInterval);

  window._heroInterval = setInterval(() => {
    window.goToSlide((current + 1) % slides.length);
  }, 5000);

  const heroSection = document.getElementById('hero-slider') || slides[0].parentElement;
  heroSection.addEventListener('mouseenter', () => clearInterval(window._heroInterval));
  heroSection.addEventListener('mouseleave', () => {
    window._heroInterval = setInterval(() => {
      window.goToSlide((current + 1) % slides.length);
    }, 5000);
  });
}


// ============================================================
// SERVICES
// ============================================================
async function loadServices() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('services-grid');

    let html = '';
    data.forEach(service => {
      const name = escapeHTML(service.title || service.name || '');
      const bgStyle = service.image_url
        ? `background-image: url('${service.image_url}');`
        : `background: linear-gradient(135deg, ${service.gradient_from || '#334155'}, ${service.gradient_to || '#1e293b'});`;

      html += `
        <div class="service-card fade-up" style="${bgStyle}">
          <div class="card-overlay"></div>
          <div class="card-badge">${name}</div>
          <div class="card-content">
            <h3>${name}</h3>
            <p>${escapeHTML(service.description || 'Professional coverage for ' + (service.title || service.name || '').toLowerCase())}</p>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading services:', err);
  }
}


// ============================================================
// TEAM MEMBERS
// ============================================================
async function loadTeamMembers() {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('team-grid');

    let html = '';
    data.forEach(member => {
      const avatarHTML = member.avatar_url
        ? `<img src="${member.avatar_url}" alt="${escapeHTML(member.name)}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto 1.25rem; display: block;" />`
        : `<div class="avatar">${getInitials(member.name)}</div>`;

      let socialHTML = '';
      if (member.instagram_url || member.twitter_url || member.linkedin_url) {
        socialHTML = '<div class="social-icons">';
        if (member.instagram_url) socialHTML += `<a href="${member.instagram_url}" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>`;
        if (member.twitter_url) socialHTML += `<a href="${member.twitter_url}" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>`;
        if (member.linkedin_url) socialHTML += `<a href="${member.linkedin_url}" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`;
        socialHTML += '</div>';
      }

      html += `
        <div class="team-card fade-up">
          ${avatarHTML}
          <h3>${escapeHTML(member.name)}</h3>
          <p class="role">${escapeHTML(member.role)}</p>
          ${member.bio ? `<p class="bio">${escapeHTML(member.bio)}</p>` : ''}
          ${socialHTML}
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading team members:', err);
  }
}


// ============================================================
// GALLERY ITEMS
// ============================================================
async function loadGalleryItems() {
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('gallery-grid');

    let html = '';
    data.forEach(item => {
      const bgStyle = item.image_url
        ? `background: url('${item.image_url}') center/cover no-repeat; aspect-ratio: ${item.aspect_ratio || '4/3'};`
        : `background: linear-gradient(135deg, ${item.gradient_from || '#334155'}, ${item.gradient_to || '#475569'}); aspect-ratio: ${item.aspect_ratio || '4/3'};`;

      const iconHTML = item.icon
        ? `<ion-icon name="${item.icon}"></ion-icon>`
        : '';

      html += `
        <div class="gallery-card fade-up" data-category="${escapeHTML(item.category || '')}">
          <div class="card-bg" style="${bgStyle}">
            ${!item.image_url ? iconHTML : ''}
          </div>
          <div class="card-overlay">
            <span>${escapeHTML(item.category || '')}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading gallery items:', err);
  }
}


// ============================================================
// REVIEWS
// ============================================================
async function loadReviews() {
  try {
    // Determine if we are on the dedicated reviews page or homepage
    const isReviewsPage = window.location.pathname.includes('reviews');

    let query = supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!isReviewsPage) {
      // Homepage: only featured, limit 3
      query = query.eq('is_featured', true).limit(3);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('reviews-grid');

    let html = '';
    data.forEach(review => {
      html += `
        <div class="review-card fade-up">
          <div class="stars">${generateStars(review.rating || 5)}</div>
          <p class="quote">"${escapeHTML(review.content)}"</p>
          <p class="reviewer">${escapeHTML(review.author_name)}</p>
          <p class="reviewer-role">${escapeHTML(review.event_type || '')}</p>
          ${review.created_at ? `<p class="review-date">${formatDate(review.created_at)}</p>` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading reviews:', err);
  }
}


// ============================================================
// PARTNERS
// ============================================================
async function loadPartners() {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('partners-grid');

    let html = '';
    data.forEach(partner => {
      if (partner.logo_url) {
        html += `
          <div class="partner-box" title="${escapeHTML(partner.name)}">
            <img src="${partner.logo_url}" alt="${escapeHTML(partner.name)}" style="max-height: 50px; max-width: 80%; object-fit: contain;" />
          </div>
        `;
      } else {
        html += `<div class="partner-box">${escapeHTML(partner.name)}</div>`;
      }
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading partners:', err);
  }
}


// ============================================================
// VALUES / WHY CHOOSE US
// ============================================================
async function loadValues() {
  try {
    const { data, error } = await supabase
      .from('values_cards')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('values-grid');

    let html = '';
    data.forEach(value => {
      html += `
        <div class="value-card fade-up">
          <div class="icon-wrap"><ion-icon name="${value.icon || 'star-outline'}"></ion-icon></div>
          <h3>${escapeHTML(value.title)}</h3>
          <p>${escapeHTML(value.description)}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading values:', err);
  }
}


// ============================================================
// JOB LISTINGS
// ============================================================
async function loadJobListings() {
  try {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('jobs-list');

    let html = '';
    data.forEach(job => {
      html += `
        <div class="job-card fade-up">
          <h3>${escapeHTML(job.title)}</h3>
          <div class="badges">
            ${job.job_type ? `<span class="badge badge-type">${escapeHTML(job.job_type)}</span>` : ''}
            ${job.location ? `<span class="badge badge-location">${escapeHTML(job.location)}</span>` : ''}
          </div>
          <p>${escapeHTML(job.description)}</p>
          <button class="btn-apply" onclick="document.querySelector('#application-form')?.scrollIntoView({ behavior: 'smooth' })">Apply Now</button>
        </div>
      `;
    });

    container.innerHTML = html;

    // Also update the position dropdown in the application form if it exists
    const positionSelect = document.getElementById('position');
    if (positionSelect) {
      let optionsHTML = '<option value="" disabled selected>Select a position</option>';
      data.forEach(job => {
        const slug = job.title.toLowerCase().replace(/\s+/g, '-');
        optionsHTML += `<option value="${slug}">${escapeHTML(job.title)}</option>`;
      });
      positionSelect.innerHTML = optionsHTML;
    }
  } catch (err) {
    console.error('Error loading job listings:', err);
  }
}


// ============================================================
// STATS
// ============================================================
async function loadStats() {
  try {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('stats-grid');

    let html = '';
    data.forEach(stat => {
      html += `
        <div class="stat-card fade-up">
          <div class="number">${escapeHTML(stat.value)}</div>
          <div class="label">${escapeHTML(stat.label)}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}


// ============================================================
// INSTAGRAM POSTS
// ============================================================
async function loadInstagramPosts() {
  try {
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('instagram-grid');

    let html = '';
    data.forEach(post => {
      if (post.post_type === 'reel' && post.embed_url) {
        html += `
          <div class="insta-box" style="aspect-ratio: 1; overflow: hidden;">
            <iframe
              src="${post.embed_url}"
              style="width: 100%; height: 100%; border: none;"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        `;
      } else {
        const bgStyle = post.image_url
          ? `background: url('${post.image_url}') center/cover no-repeat;`
          : `background: linear-gradient(135deg, ${post.gradient_from || '#334155'}, ${post.gradient_to || '#475569'});`;

        html += `
          <div class="insta-box" style="${bgStyle}">
            <div class="insta-overlay"><i class="fa-brands fa-instagram"></i></div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading Instagram posts:', err);
  }
}


// ============================================================
// DISCOVER CARDS
// ============================================================
async function loadDiscoverCards() {
  try {
    const { data, error } = await supabase
      .from('discover_cards')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return;

    const container = document.getElementById('discover-grid');

    let html = '';
    data.forEach(card => {
      const bgStyle = card.image_url
        ? `background: url('${card.image_url}') center/cover no-repeat;`
        : `background: linear-gradient(135deg, ${card.gradient_from || '#1e3a8a'}, ${card.gradient_to || '#3b82f6'});`;

      html += `
        <div class="discover-card fade-up">
          <div class="bg" style="${bgStyle}"></div>
          <div class="card-overlay">
            <h3>${escapeHTML(card.title)}</h3>
            ${card.description ? `<p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 0.75rem;">${escapeHTML(card.description)}</p>` : ''}
            ${card.link_url ? `<a href="${card.link_url}">${escapeHTML(card.link_text || 'Learn More')}</a>` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading discover cards:', err);
  }
}


// ============================================================
// SITE SETTINGS
// ============================================================
async function loadSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;
    if (!data || data.length === 0) return;

    // Create settings map
    const settings = {};
    data.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    // Update footer company description
    const footerAbout = document.querySelector('.site-footer .grid > div:first-child p');
    if (footerAbout && settings.company_description) {
      footerAbout.textContent = settings.company_description;
    }

    // Update footer email
    if (settings.email) {
      const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
      emailLinks.forEach(link => {
        link.href = `mailto:${settings.email}`;
        link.textContent = settings.email;
      });
    }

    // Update footer phone numbers
    if (settings.phone_1) {
      const phone1Links = document.querySelectorAll('a[href*="tel:"]');
      if (phone1Links.length > 0) {
        const cleanNum = settings.phone_1.replace(/\s/g, '');
        phone1Links[0].href = `tel:${cleanNum}`;
        phone1Links[0].textContent = settings.phone_1;
      }
    }
    if (settings.phone_2) {
      const phone2Links = document.querySelectorAll('a[href*="tel:"]');
      if (phone2Links.length > 1) {
        const cleanNum = settings.phone_2.replace(/\s/g, '');
        phone2Links[1].href = `tel:${cleanNum}`;
        phone2Links[1].textContent = settings.phone_2;
      }
    }

    // Update footer address
    if (settings.address) {
      const addressEl = document.querySelector('.site-footer .fa-location-dot');
      if (addressEl && addressEl.parentElement) {
        const textNode = addressEl.parentElement.childNodes;
        // Replace text after the icon
        for (let i = textNode.length - 1; i >= 0; i--) {
          if (textNode[i].nodeType === Node.TEXT_NODE) {
            textNode[i].textContent = ' ' + settings.address;
            break;
          }
        }
      }
    }

    // Update social links in footer
    const socialMap = {
      instagram_url: 'fa-instagram',
      facebook_url: 'fa-facebook-f',
      twitter_url: 'fa-x-twitter',
      youtube_url: 'fa-youtube',
      tiktok_url: 'fa-tiktok',
    };

    Object.entries(socialMap).forEach(([key, iconClass]) => {
      if (settings[key]) {
        const socialLinks = document.querySelectorAll(`.footer-social a i.${iconClass}, .nav-social a i.${iconClass}, .mobile-social a i.${iconClass}`);
        socialLinks.forEach(icon => {
          const link = icon.closest('a');
          if (link) link.href = settings[key];
        });
      }
    });

    // Update WhatsApp modal numbers
    if (settings.whatsapp_1 || settings.phone_1) {
      const waNum = settings.whatsapp_1 || settings.phone_1;
      const cleanWA = waNum.replace(/[\s\+\-]/g, '');
      const waLinks = document.querySelectorAll('.wa-modal .wa-number');
      if (waLinks.length > 0) {
        waLinks[0].href = `https://wa.me/${cleanWA}`;
        waLinks[0].innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${waNum}`;
      }
    }
    if (settings.whatsapp_2 || settings.phone_2) {
      const waNum = settings.whatsapp_2 || settings.phone_2;
      const cleanWA = waNum.replace(/[\s\+\-]/g, '');
      const waLinks = document.querySelectorAll('.wa-modal .wa-number');
      if (waLinks.length > 1) {
        waLinks[1].href = `https://wa.me/${cleanWA}`;
        waLinks[1].innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${waNum}`;
      }
    }

    // Update contact page info if present
    const contactEmail = document.getElementById('contact-email');
    if (contactEmail && settings.email) contactEmail.textContent = settings.email;

    const contactPhone1 = document.getElementById('contact-phone-1');
    if (contactPhone1 && settings.phone_1) contactPhone1.textContent = settings.phone_1;

    const contactPhone2 = document.getElementById('contact-phone-2');
    if (contactPhone2 && settings.phone_2) contactPhone2.textContent = settings.phone_2;

    const contactAddress = document.getElementById('contact-address');
    if (contactAddress && settings.address) contactAddress.textContent = settings.address;

  } catch (err) {
    console.error('Error loading site settings:', err);
  }
}


// ============================================================
// GSAP SCROLL ANIMATIONS
// ============================================================
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Kill existing ScrollTriggers to avoid duplicates
  ScrollTrigger.getAll().forEach(t => t.kill());

  const fadeUpElements = document.querySelectorAll('.fade-up');
  fadeUpElements.forEach((el, index) => {
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        delay: (index % 6) * 0.1,
      }
    );
  });

  ScrollTrigger.refresh();
}


// ============================================================
// CONTACT FORM SUBMISSION
// ============================================================
function attachContactForm() {
  const form = document.getElementById('contact-form') || document.getElementById('bookingForm');
  if (!form) return;

  form.onsubmit = async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"], .btn-submit');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.5rem;"></i> Sending...';
    }

    try {
      const formData = new FormData(form);
      const payload = {
        first_name: formData.get('firstName') || formData.get('first_name') || '',
        last_name: formData.get('lastName') || formData.get('last_name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        service: formData.get('service') || '',
        venue: formData.get('venue') || '',
        event_date: formData.get('eventDate') || formData.get('event_date') || null,
        city: formData.get('city') || '',
        message: formData.get('message') || '',
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert([payload]);

      if (error) throw error;

      form.reset();
      showToast('Thank you! Your message has been received. We will contact you soon.', 'success');
    } catch (err) {
      console.error('Contact form error:', err);
      showToast('Something went wrong. Please try again or contact us directly.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  };
}


// ============================================================
// JOB APPLICATION FORM SUBMISSION
// ============================================================
function attachApplicationForm() {
  const form = document.getElementById('application-form');
  // Fallback: find the career application form by its container
  const formEl = form || document.querySelector('.form-body form[onsubmit="return false;"]');
  if (!formEl) return;

  // Remove the inline onsubmit handler
  formEl.removeAttribute('onsubmit');

  formEl.onsubmit = async function(e) {
    e.preventDefault();

    const submitBtn = formEl.querySelector('button[type="submit"], .btn-submit');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.5rem;"></i> Submitting...';
    }

    try {
      let cvUrl = null;

      // Upload CV if provided
      const cvInput = formEl.querySelector('input[type="file"]');
      if (cvInput && cvInput.files && cvInput.files.length > 0) {
        const file = cvInput.files[0];
        const fileName = `${Date.now()}-${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('job-applications')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('job-applications')
          .getPublicUrl(fileName);

        cvUrl = urlData.publicUrl;
      }

      const payload = {
        full_name: formEl.querySelector('#name')?.value || '',
        email: formEl.querySelector('#email')?.value || '',
        position: formEl.querySelector('#position')?.value || '',
        portfolio_url: formEl.querySelector('#portfolio')?.value || '',
        cover_letter: formEl.querySelector('#cover-letter')?.value || '',
        cv_url: cvUrl,
      };

      const { error } = await supabase
        .from('job_applications')
        .insert([payload]);

      if (error) throw error;

      formEl.reset();
      showToast('Application submitted successfully! We will review it and get back to you.', 'success');
    } catch (err) {
      console.error('Application form error:', err);
      showToast('Something went wrong. Please try again or email us directly.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  };
}


// ============================================================
// REVIEW FORM SUBMISSION
// ============================================================
function attachReviewForm() {
  const form = document.getElementById('review-form');
  // Fallback: look for the review form section
  const reviewSection = document.getElementById('leave-review');
  const formEl = form || (reviewSection ? reviewSection.querySelector('form') : null);
  if (!formEl) return;

  // Remove inline onsubmit handler
  formEl.removeAttribute('onsubmit');

  // Star rating interaction
  let selectedRating = 0;
  const starContainer = document.getElementById('starRating');
  if (starContainer) {
    const stars = starContainer.querySelectorAll('i');
    stars.forEach(star => {
      star.style.cursor = 'pointer';
      star.style.transition = 'color 0.2s';

      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'));
        stars.forEach(s => {
          const val = parseInt(s.getAttribute('data-value'));
          s.style.color = val <= selectedRating ? '#fbbf24' : '#d1d5db';
        });
      });

      star.addEventListener('mouseenter', () => {
        const hoverVal = parseInt(star.getAttribute('data-value'));
        stars.forEach(s => {
          const val = parseInt(s.getAttribute('data-value'));
          s.style.color = val <= hoverVal ? '#fbbf24' : '#d1d5db';
        });
      });
    });

    starContainer.addEventListener('mouseleave', () => {
      const stars = starContainer.querySelectorAll('i');
      stars.forEach(s => {
        const val = parseInt(s.getAttribute('data-value'));
        s.style.color = val <= selectedRating ? '#fbbf24' : '#d1d5db';
      });
    });
  }

  formEl.onsubmit = async function(e) {
    e.preventDefault();

    if (selectedRating === 0) {
      showToast('Please select a rating before submitting.', 'error');
      return;
    }

    const submitBtn = formEl.querySelector('button[type="submit"], .btn-submit');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.5rem;"></i> Submitting...';
    }

    try {
      const payload = {
        author_name: document.getElementById('reviewName')?.value || 'Anonymous',
        event_type: document.getElementById('eventType')?.value || '',
        rating: selectedRating,
        content: document.getElementById('reviewText')?.value || '',
        is_active: false, // Needs admin approval
        is_featured: false,
      };

      const { error } = await supabase
        .from('reviews')
        .insert([payload]);

      if (error) throw error;

      formEl.reset();
      selectedRating = 0;
      if (starContainer) {
        starContainer.querySelectorAll('i').forEach(s => {
          s.style.color = '#d1d5db';
        });
      }
      showToast('Thank you for your review! It will appear on the site after approval.', 'success');
    } catch (err) {
      console.error('Review form error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  };
}


// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate star rating HTML
 * @param {number} rating - Number of filled stars (1-5)
 * @returns {string} HTML string with gold/gray stars
 */
function generateStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += '<i class="fa-solid fa-star" style="color: #fbbf24;"></i>';
    } else {
      html += '<i class="fa-solid fa-star" style="color: #d1d5db;"></i>';
    }
  }
  return html;
}

/**
 * Get initials from a name string
 * @param {string} name - Full name
 * @returns {string} Initials (up to 2 characters)
 */
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

/**
 * Format a date string nicely
 * @param {string} dateStr - ISO date string or similar
 * @returns {string} Formatted date like "January 15, 2026"
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - Raw string
 * @returns {string} Escaped HTML string
 */
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type) {
  // Remove any existing toast
  const existing = document.getElementById('toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 2rem;
    max-width: 400px;
    padding: 1rem 1.5rem;
    border-radius: 14px;
    color: #fff;
    font-weight: 600;
    font-size: 0.95rem;
    z-index: 9999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    transform: translateX(120%);
    transition: transform 0.4s ease;
    font-family: 'Titillium Web', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  `;

  if (type === 'success') {
    toast.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHTML(message)}`;
  } else {
    toast.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
    toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${escapeHTML(message)}`;
  }

  document.body.appendChild(toast);

  // Slide in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}
