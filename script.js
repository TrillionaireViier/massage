// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.boxShadow = "none"
  }
})

// Service booking buttons
document.querySelectorAll(".btn-book").forEach((button) => {
  button.addEventListener("click", () => {
    const serviceCard = button.closest(".service-card")
    const serviceName = serviceCard.querySelector("h3").textContent

    // Scroll to booking form
    document.querySelector("#booking").scrollIntoView({
      behavior: "smooth",
    })

    // Pre-select the service in the form
    setTimeout(() => {
      const serviceSelect = document.querySelector("#appointmentForm select")
      const options = serviceSelect.querySelectorAll("option")

      options.forEach((option) => {
        if (option.textContent.includes(serviceName.split(" ")[0])) {
          option.selected = true
        }
      })
    }, 500)
  })
})

// Form submission
document.getElementById("appointmentForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = new FormData(this)
  const name = formData.get("name") || this.querySelector('input[type="text"]').value
  const email = formData.get("email") || this.querySelector('input[type="email"]').value
  const phone = formData.get("phone") || this.querySelector('input[type="tel"]').value
  const service = formData.get("service") || this.querySelector("select").value

  // Basic validation
  if (!name || !email || !phone || !service) {
    alert("Please fill in all fields")
    return
  }

  // Simulate form submission
  const button = this.querySelector('button[type="submit"]')
  const originalText = button.textContent

  button.textContent = "Sending..."
  button.disabled = true

  setTimeout(() => {
    alert(
      `Thank you, ${name}! Your appointment request has been received. We'll contact you at ${phone} to confirm your ${service} session.`,
    )
    this.reset()
    button.textContent = originalText
    button.disabled = false
  }, 1500)
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for scroll animations
document.querySelectorAll(".service-card, .gallery-item, .product-card, .stat").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Gallery image lazy loading
document.querySelectorAll(".gallery-item img, .product-card img").forEach((img) => {
  img.addEventListener("load", function () {
    this.style.opacity = "1"
  })

  img.style.opacity = "0"
  img.style.transition = "opacity 0.3s ease"
})

document.querySelectorAll("img").forEach((img) => {
  let retryCount = 0
  const maxRetries = 3

  // Add loading placeholder
  img.style.background = "#f0f0f0"
  img.style.minHeight = "200px"
  img.style.display = "flex"
  img.style.alignItems = "center"
  img.style.justifyContent = "center"

  function handleImageError() {
    retryCount++
    console.log(`[v0] Image failed to load: ${img.src}, retry ${retryCount}`)

    if (retryCount <= maxRetries) {
      // Retry loading the image with cache busting
      setTimeout(() => {
        const separator = img.src.includes("?") ? "&" : "?"
        img.src = img.src.split("?")[0] + `${separator}retry=${retryCount}&t=${Date.now()}`
      }, 1000 * retryCount)
    } else {
      // Show placeholder after max retries
      img.style.background = "#e2e8f0"
      img.style.color = "#64748b"
      img.style.fontSize = "14px"
      img.style.fontWeight = "500"
      img.innerHTML = "<span>Image Loading...</span>"
      console.log(`[v0] Image failed after ${maxRetries} retries: ${img.src}`)
    }
  }

  function handleImageLoad() {
    console.log(`[v0] Image loaded successfully: ${img.src}`)
    img.style.background = "transparent"
    img.innerHTML = ""
  }

  img.addEventListener("error", handleImageError)
  img.addEventListener("load", handleImageLoad)

  // Check if image is already loaded (cached)
  if (img.complete && img.naturalHeight !== 0) {
    handleImageLoad()
  }
})

// Pricing hover effects
document.querySelectorAll(".price-option").forEach((option) => {
  option.addEventListener("mouseenter", function () {
    this.style.backgroundColor = "#f8f9fa"
    this.style.transform = "translateX(5px)"
  })

  option.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "transparent"
    this.style.transform = "translateX(0)"
  })

  option.style.transition = "all 0.3s ease"
})

// Hero Slider Functionality
let currentSlide = 0
const slides = document.querySelectorAll(".slide")
const dots = document.querySelectorAll(".dot")
const totalSlides = slides.length

function loadSlideBackground(slide) {
  const bgUrl = slide.dataset.bg
  if (bgUrl && !slide.style.backgroundImage) {
    console.log(`[v0] Loading slide background: ${bgUrl}`)

    // Create a new image to test loading
    const testImg = new Image()
    testImg.onload = () => {
      slide.style.backgroundImage = `url('${bgUrl}')`
      console.log(`[v0] Slide background loaded: ${bgUrl}`)
    }
    testImg.onerror = () => {
      console.log(`[v0] Slide background failed: ${bgUrl}`)
      // Use a fallback gradient background
      slide.style.background = "linear-gradient(135deg, #1e293b 0%, #475569 100%)"
    }
    testImg.src = bgUrl
  }
}

function preloadAdjacentSlides(currentIndex) {
  const nextIndex = (currentIndex + 1) % totalSlides
  const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides

  loadSlideBackground(slides[nextIndex])
  loadSlideBackground(slides[prevIndex])
}

function showSlide(index) {
  // Remove active class from all slides and dots
  slides.forEach((slide) => slide.classList.remove("active", "prev"))
  dots.forEach((dot) => dot.classList.remove("active"))

  // Add prev class to current slide before changing
  if (slides[currentSlide]) {
    slides[currentSlide].classList.add("prev")
  }

  // Update current slide index
  currentSlide = index

  loadSlideBackground(slides[currentSlide])
  preloadAdjacentSlides(currentSlide)

  // Add active class to new slide and dot
  slides[currentSlide].classList.add("active")
  dots[currentSlide].classList.add("active")

  // Reset animations for slide content
  const slideContent = slides[currentSlide].querySelectorAll(
    ".hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-image img",
  )
  slideContent.forEach((element, i) => {
    element.style.animation = "none"
    setTimeout(() => {
      element.style.animation = ""
    }, 50)
  })
}

function nextSlide() {
  const next = (currentSlide + 1) % totalSlides
  showSlide(next)
}

function prevSlide() {
  const prev = (currentSlide - 1 + totalSlides) % totalSlides
  showSlide(prev)
}

// Event listeners for navigation
document.querySelector(".next-btn").addEventListener("click", nextSlide)
document.querySelector(".prev-btn").addEventListener("click", prevSlide)

// Event listeners for dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showSlide(index))
})

// Auto-play slider
let autoPlayInterval = setInterval(nextSlide, 5000)

// Pause auto-play on hover
const heroSlider = document.querySelector(".hero-slider")
heroSlider.addEventListener("mouseenter", () => {
  clearInterval(autoPlayInterval)
})

heroSlider.addEventListener("mouseleave", () => {
  autoPlayInterval = setInterval(nextSlide, 5000)
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevSlide()
  } else if (e.key === "ArrowRight") {
    nextSlide()
  }
})

// Touch/swipe support for mobile
let touchStartX = 0
let touchEndX = 0

heroSlider.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX
})

heroSlider.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
})

function handleSwipe() {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide() // Swipe left - next slide
    } else {
      prevSlide() // Swipe right - previous slide
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Load the first slide background immediately
  loadSlideBackground(slides[0])
  // Preload adjacent slides
  preloadAdjacentSlides(0)
})
