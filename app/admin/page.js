"use client";

import { useState, useEffect, useRef } from "react";
import SuccessModal from "@/components/SuccessModal";
import { formatImagePath } from "@/lib/utils";
import "./admin.css";

export default function AdminPage() {
  // Passcode gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [lockModal, setLockModal] = useState({ open: false, success: false, title: "", text: "" });

  // Core database state
  const [products, setProducts] = useState([]);
  const [diamonds, setDiamonds] = useState([]);
  const [content, setContent] = useState({});
  const [images, setImages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Active sidebar state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Success Modal toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastText, setToastText] = useState("");

  // Search & Filter state
  const [searchProduct, setSearchProduct] = useState("");
  const [filterProductCat, setFilterProductCat] = useState("all");
  const [searchDiamond, setSearchDiamond] = useState("");
  const [filterDiamondShape, setFilterDiamondShape] = useState("all");

  // CRUD Modals state
  const [productModal, setProductModal] = useState({ open: false, type: "add", data: null });
  const [diamondModal, setDiamondModal] = useState({ open: false, type: "add", data: null });

  // Inputs for adding/editing dynamic lists
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    category: "rings",
    image: "",
    moq: "10 Pieces",
    alloys: "14k / 18k Yellow Gold, White Gold, Rose Gold, Platinum",
    gemstones: "IGI Certified Diamonds",
    leadTime: "10-12 Business Days",
    packaging: "Premium wooden ring boxes inside custom export cartons",
    fobPrice: "Starting at $1,250 / unit",
    description: "",
  });

  const [diamondForm, setDiamondForm] = useState({
    id: "",
    name: "",
    carat: 1.0,
    shape: "round",
    cut: "Excellent",
    clarity: "VS1",
    color: "E",
    image: "images/diamond-round.png",
    gallery: [],
    isNew: false,
    isFeatured: false,
    isRare: false,
    isInvestment: false,
    measurements: "6.50 x 6.48 x 4.01 mm",
    table: "57%",
    depth: "61.8%",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    certificate: "IGI #",
  });

  // Files input references
  const mediaInputRef = useRef(null);
  const productImgInputRef = useRef(null);
  const diamondImgInputRef = useRef(null);

  // Authenticate on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("aurelia_authenticated") === "true";
      if (isAuth) {
        setIsAuthenticated(true);
        fetchData();
        addLog("Admin Session Resumed", "Authorized console unlocked.");
      }
    }
  }, []);

  const handleUnlock = () => {
    const defaultPasscode = "admin@123";
    if (passcode === defaultPasscode) {
      localStorage.setItem("aurelia_authenticated", "true");
      setPasscodeError(false);
      setLockModal({
        open: true,
        success: true,
        title: "Access Granted",
        text: "Welcome to Aurelia Control Center. System authorization granted successfully."
      });
    } else {
      setPasscodeError(true);
      setPasscode("");
      setLockModal({
        open: true,
        success: false,
        title: "Access Denied",
        text: "Incorrect admin authorization passcode. Please check your credentials and try again."
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("aurelia_authenticated");
    setIsAuthenticated(false);
    showToast("Logged Out", "Session ended successfully.");
  };

  // Fetch initial datasets
  const fetchData = async () => {
    try {
      // Fetch Products & Diamonds
      const prodRes = await fetch("/api/products");
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products || []);
        setDiamonds(prodData.diamonds || []);
      }

      // Fetch Copywriting content
      const contentRes = await fetch("/api/content");
      const contentData = await contentRes.json();
      if (contentData.success) {
        setContent(contentData.content || {});
      }

      // Fetch Images
      const imgRes = await fetch("/api/images");
      const imgData = await imgRes.json();
      if (imgData.success) {
        setImages(imgData.images || []);
      }

      // Fetch Inquiries
      const inqRes = await fetch("/api/inquiries");
      const inqData = await inqRes.json();
      if (inqData.success) {
        setInquiries(inqData.inquiries || []);
      }
    } catch (e) {
      showToast("Fetch Error", "Failed to synchronize disk database.", "error");
      console.error(e);
    }
  };

  // Toast notifier
  const showToast = (title, text) => {
    setToastTitle(title);
    setToastText(text);
    setToastOpen(true);
  };

  // Logging system helper
  const addLog = (action, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ timestamp, action, details }, ...prev]);
  };

  // Dynamic Metrics counts
  const productCount = products.length;
  const diamondCount = diamonds.length;
  const imageCount = images.length;

  const ringsCount = products.filter((p) => p.category === "rings").length;
  const necklacesCount = products.filter((p) => p.category === "necklaces").length;
  const braceletsCount = products.filter((p) => p.category === "bracelets").length;
  const earringsCount = products.filter((p) => p.category === "earrings").length;

  // Search filter lists
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.id.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.gemstones.toLowerCase().includes(searchProduct.toLowerCase());
    const matchesCat = filterProductCat === "all" || p.category === filterProductCat;
    return matchesSearch && matchesCat;
  });

  const filteredDiamonds = diamonds.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchDiamond.toLowerCase()) ||
      d.certificate.toLowerCase().includes(searchDiamond.toLowerCase());
    const matchesShape = filterDiamondShape === "all" || d.shape === filterDiamondShape;
    return matchesSearch && matchesShape;
  });

  // Media upload handlers
  const handleUploadImage = async (e, target = "library") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      showToast("Uploading...", "Sending file asset to server...");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        showToast("Upload Successful", `File saved as ${data.filepath}`);
        addLog("Media File Uploaded", `Added file: ${data.filename}`);

        // Update target field if called from product/diamond forms
        if (target === "product") {
          setProductForm((prev) => ({ ...prev, image: data.filepath }));
        } else if (target === "diamond") {
          setDiamondForm((prev) => ({ ...prev, image: data.filepath }));
        }

        // Refresh Media List
        fetchData();
      } else {
        showToast("Upload Failed", data.message || "Failed to parse upload.");
      }
    } catch (err) {
      showToast("Error", "Server upload route failed.");
    }
  };

  // Products CRUD handlers
  const handleOpenProductModal = (type, data = null) => {
    if (type === "edit" && data) {
      setProductForm({ 
        ...data,
        isActive: data.isActive !== false,
        gallery: data.gallery && Array.isArray(data.gallery) ? data.gallery : (data.image ? [data.image] : [])
      });
    } else {
      setProductForm({
        id: "",
        name: "",
        category: "rings",
        image: "",
        gallery: [],
        isActive: true,
        moq: "10 Pieces",
        alloys: "14k / 18k Yellow Gold, White Gold, Rose Gold, Platinum (PT950)",
        gemstones: "IGI Certified Diamonds",
        leadTime: "10-12 Business Days",
        packaging: "Premium wooden ring boxes inside custom export cartons",
        fobPrice: "Starting at $1,250 / unit",
        description: "",
      });
    }
    setProductModal({ open: true, type, data });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    let updatedProducts = [...products];

    const slugify = (text) => {
      if (!text) return "";
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
    };

    if (productModal.type === "add") {
      const baseSlug = slugify(productForm.name);
      let generatedId = baseSlug || `product-${Date.now()}`;
      
      let uniqueId = generatedId;
      let counter = 1;
      while (products.some((p) => p.id === uniqueId)) {
        uniqueId = `${generatedId}-${counter}`;
        counter++;
      }

      const newProduct = { 
        ...productForm, 
        id: uniqueId,
        moq: productForm.moq || "10 Pieces",
        gallery: productForm.gallery && productForm.gallery.length > 0 ? productForm.gallery : (productForm.image ? [productForm.image] : []) 
      };
      updatedProducts.push(newProduct);
      addLog("Added Product", `Created product: ${newProduct.name} (${newProduct.id})`);
    } else {
      const idx = products.findIndex((p) => p.id === productModal.data.id);
      if (idx > -1) {
        const updatedProduct = {
          ...productForm,
          moq: productForm.moq || "10 Pieces",
          gallery: productForm.gallery && productForm.gallery.length > 0 ? productForm.gallery : (productForm.image ? [productForm.image] : [])
        };
        updatedProducts[idx] = updatedProduct;
        addLog("Edited Product", `Updated product specs: ${updatedProduct.name}`);
      }
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updatedProducts, diamonds }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(updatedProducts);
        setProductModal({ open: false, type: "add", data: null });
        showToast("Success", "Product catalog updated on disk.");
      }
    } catch (err) {
      showToast("Error", "Failed to post product data.");
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Are you absolutely sure you want to delete product "${name}"?`)) return;

    const updated = products.filter((p) => p.id !== id);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updated, diamonds }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(updated);
        addLog("Deleted Product", `Removed product: ${name} (${id})`);
        showToast("Success", "Product removed successfully.");
      }
    } catch (err) {
      showToast("Error", "Failed to delete product.");
    }
  };

  const handleToggleStatus = async (productId, name, currentStatus) => {
    const nextStatus = currentStatus === false;
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, isActive: nextStatus };
      }
      return p;
    });

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updatedProducts, diamonds }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(updatedProducts);
        addLog("Toggled Status", `Set product "${name}" to ${nextStatus ? "Active" : "Inactive"}`);
        showToast("Status Changed", `Product is now ${nextStatus ? "Active (visible)" : "Inactive (hidden)"}.`);
      }
    } catch (err) {
      showToast("Error", "Failed to update product status.");
    }
  };

  // Diamonds CRUD handlers
  const handleOpenDiamondModal = (type, data = null) => {
    if (type === "edit" && data) {
      setDiamondForm({ 
        ...data,
        gallery: data.gallery && Array.isArray(data.gallery) ? data.gallery : (data.image ? [data.image] : [])
      });
    } else {
      setDiamondForm({
        id: "",
        name: "",
        carat: 1.0,
        shape: "round",
        cut: "Excellent",
        clarity: "VS1",
        color: "E",
        image: "images/diamond-round.png",
        gallery: [],
        isNew: false,
        isFeatured: false,
        isRare: false,
        isInvestment: false,
        measurements: "6.50 x 6.48 x 4.01 mm",
        table: "57%",
        depth: "61.8%",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        certificate: "IGI #",
      });
    }
    setDiamondModal({ open: true, type, data });
  };

  const handleSaveDiamond = async (e) => {
    e.preventDefault();
    let updatedDiamonds = [...diamonds];

    if (diamondModal.type === "add") {
      const newDiamond = { 
        ...diamondForm, 
        id: Date.now(),
        carat: parseFloat(diamondForm.carat) || 1.0,
        gallery: diamondForm.gallery && diamondForm.gallery.length > 0 ? diamondForm.gallery : (diamondForm.image ? [diamondForm.image] : []) 
      };
      updatedDiamonds.push(newDiamond);
      addLog("Added Diamond", `Created IGI spec item: ${newDiamond.name}`);
    } else {
      const idx = diamonds.findIndex((d) => d.id === diamondModal.data.id);
      if (idx > -1) {
        const updatedDiamond = { 
          ...diamondForm,
          carat: parseFloat(diamondForm.carat) || 1.0,
          gallery: diamondForm.gallery && diamondForm.gallery.length > 0 ? diamondForm.gallery : (diamondForm.image ? [diamondForm.image] : []) 
        };
        updatedDiamonds[idx] = updatedDiamond;
        addLog("Edited Diamond", `Updated diamond specs: ${updatedDiamond.name}`);
      }
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products, diamonds: updatedDiamonds }),
      });
      const data = await res.json();
      if (data.success) {
        setDiamonds(updatedDiamonds);
        setDiamondModal({ open: false, type: "add", data: null });
        showToast("Success", "Diamond database updated on disk.");
      }
    } catch (err) {
      showToast("Error", "Failed to post diamond data.");
    }
  };

  const handleDeleteDiamond = async (id, name) => {
    if (!confirm(`Are you absolutely sure you want to delete diamond "${name}"?`)) return;

    const updated = diamonds.filter((d) => d.id !== id);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products, diamonds: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setDiamonds(updated);
        addLog("Deleted Diamond", `Removed loose stone: ${name}`);
        showToast("Success", "Diamond deleted successfully.");
      }
    } catch (err) {
      showToast("Error", "Failed to delete diamond.");
    }
  };

  // Content Copywriting Save handler
  const handleSaveContent = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Deep merge changes into content structure
    const updatedContent = JSON.parse(JSON.stringify(content));

    // Home Hero
    if (!updatedContent.home) updatedContent.home = {};
    if (!updatedContent.home.hero) updatedContent.home.hero = {};
    updatedContent.home.hero.subtitle = formData.get("home_hero_subtitle");
    updatedContent.home.hero.title = formData.get("home_hero_title");
    updatedContent.home.hero.description = formData.get("home_hero_description");

    // Home Craftsmanship
    if (!updatedContent.home.craftsmanship) updatedContent.home.craftsmanship = {};
    updatedContent.home.craftsmanship.subtitle = formData.get("home_craft_subtitle");
    updatedContent.home.craftsmanship.title = formData.get("home_craft_title");
    updatedContent.home.craftsmanship.description1 = formData.get("home_craft_desc1");
    updatedContent.home.craftsmanship.description2 = formData.get("home_craft_desc2");

    // About Hero
    if (!updatedContent.about) updatedContent.about = {};
    if (!updatedContent.about.hero) updatedContent.about.hero = {};
    updatedContent.about.hero.subtitle = formData.get("about_hero_subtitle");
    updatedContent.about.hero.title = formData.get("about_hero_title");

    // About Philosophy
    if (!updatedContent.about.philosophy) updatedContent.about.philosophy = {};
    updatedContent.about.philosophy.subtitle = formData.get("about_philosophy_subtitle");
    updatedContent.about.philosophy.title = formData.get("about_philosophy_title");
    updatedContent.about.philosophy.description1 = formData.get("about_philosophy_desc1");
    updatedContent.about.philosophy.description2 = formData.get("about_philosophy_desc2");
    updatedContent.about.philosophy.feature1Title = formData.get("about_philosophy_f1title");
    updatedContent.about.philosophy.feature1Desc = formData.get("about_philosophy_f1desc");
    updatedContent.about.philosophy.feature2Title = formData.get("about_philosophy_f2title");
    updatedContent.about.philosophy.feature2Desc = formData.get("about_philosophy_f2desc");

    // Contact Info
    if (!updatedContent.contact) updatedContent.contact = {};
    if (!updatedContent.contact.info) updatedContent.contact.info = {};
    updatedContent.contact.info.address = formData.get("contact_address");
    updatedContent.contact.info.phone = formData.get("contact_phone");
    updatedContent.contact.info.email = formData.get("contact_email");
    updatedContent.contact.info.mapUrl = formData.get("contact_map_url");

    // Global Settings & Social Links
    if (!updatedContent.settings) updatedContent.settings = {};
    updatedContent.settings.whatsappNumber = formData.get("settings_whatsapp");
    updatedContent.settings.instagram = formData.get("settings_instagram");
    updatedContent.settings.facebook = formData.get("settings_facebook");
    updatedContent.settings.linkedin = formData.get("settings_linkedin");
    updatedContent.settings.youtube = formData.get("settings_youtube");

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedContent }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(updatedContent);
        addLog("Updated Site Content", "Copy and descriptions saved to disk.");
        showToast("Success", "Copywriting configurations updated.");
      }
    } catch (err) {
      showToast("Error", "Failed to update site content configurations.");
    }
  };

  // Lockscreen display before auth
  if (!isAuthenticated) {
    return (
      <div className="lock-screen active" id="lockScreen">
        <div className="lock-box">
          <div className="lock-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 className="lock-title">AURELIA<span>.</span></h2>
          <p className="lock-subtitle">SECURE CONTROL CENTER ACCESS</p>
          
          <div className="lock-input-group">
            <input 
              type="password" 
              id="passcodeInput" 
              className="lock-input" 
              placeholder="••••••••" 
              maxLength={20}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUnlock();
              }}
              autoFocus
            />
          </div>
          
          <button className="lock-btn" id="unlockBtn" onClick={handleUnlock}>AUTHENTICATE</button>
          <div className={`lock-error ${passcodeError ? "show" : ""}`} id="lockError">
            Incorrect admin authorization passcode.
          </div>
        </div>

        {lockModal.open && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99999,
              padding: "1.5rem"
            }}
            onClick={() => {
              if (!lockModal.success) {
                setLockModal(prev => ({ ...prev, open: false }));
              }
            }}
          >
            <div 
              style={{
                background: "#121214",
                border: `1px solid ${lockModal.success ? "#28c76f" : "#ea5455"}`,
                borderRadius: "8px",
                padding: "2.5rem",
                width: "100%",
                maxWidth: "420px",
                textAlign: "center",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)",
                fontFamily: "'Montserrat', sans-serif"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: "2.8rem", color: lockModal.success ? "#28c76f" : "#ea5455", marginBottom: "1rem" }}>
                <i className={lockModal.success ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation"}></i>
              </div>
              <h3 
                style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: "1.45rem", 
                  color: "#ffffff", 
                  marginBottom: "1rem",
                  letterSpacing: "1px"
                }}
              >
                {lockModal.title}
              </h3>
              <p 
                style={{ 
                  color: "#a0a0ab", 
                  fontSize: "0.92rem", 
                  lineHeight: "1.6", 
                  marginBottom: "2rem" 
                }}
              >
                {lockModal.text}
              </p>
              <button 
                onClick={() => {
                  setLockModal(prev => ({ ...prev, open: false }));
                  if (lockModal.success) {
                    setIsAuthenticated(true);
                    fetchData();
                    addLog("Authentication Successful", "System authorization granted.");
                  }
                }}
                style={{
                  background: lockModal.success ? "#28c76f" : "#ea5455",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.8rem 2.2rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  transition: "opacity 0.2s"
                }}
              >
                {lockModal.success ? "Proceed" : "Try Again"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard structure
  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          AURELIA<span>.</span> CONTROL
        </div>
        <nav className="sidebar-nav">
          <button 
            type="button"
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`} 
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="fa-solid fa-chart-line"></i> Dashboard
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === "products" ? "active" : ""}`} 
            onClick={() => setActiveTab("products")}
          >
            <i className="fa-solid fa-gem"></i> Jewelry Catalog
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === "diamonds" ? "active" : ""}`} 
            onClick={() => setActiveTab("diamonds")}
          >
            <i className="fa-regular fa-gem"></i> Loose Diamonds
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === "inquiries" ? "active" : ""}`} 
            onClick={() => setActiveTab("inquiries")}
          >
            <i className="fa-solid fa-envelope"></i> Customer Inquiries
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === "content" ? "active" : ""}`} 
            onClick={() => setActiveTab("content")}
          >
            <i className="fa-solid fa-file-pen"></i> Page Content Editor
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === "media" ? "active" : ""}`} 
            onClick={() => setActiveTab("media")}
          >
            <i className="fa-solid fa-images"></i> Media Library
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === "logs" ? "active" : ""}`} 
            onClick={() => setActiveTab("logs")}
          >
            <i className="fa-solid fa-receipt"></i> Console Logs
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" id="logoutBtn">
            <i className="fa-solid fa-lock"></i> Lock Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Topbar Header */}
        <header className="topbar">
          <div className="topbar-title">
            <h1 id="panelTitle" style={{ textTransform: "capitalize" }}>
              {activeTab === "products"
                ? "Jewelry Products Catalog"
                : activeTab === "diamonds"
                ? "Loose Certified Diamonds"
                : activeTab === "inquiries"
                ? "Customer Sourcing Inquiries"
                : activeTab === "content"
                ? "Page Copy Editor"
                : activeTab === "media"
                ? "Media Assets Library"
                : activeTab === "logs"
                ? "Security Audit Trail"
                : "Dashboard Overview"}
            </h1>
          </div>
          <div className="topbar-actions" id="topbarActions">
            {/* Action buttons are now positioned inside the respective catalog tab controls */}
          </div>
        </header>

        {/* Dashboard Panels */}
        <div style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
          {/* 1. Dashboard Panel */}
          {activeTab === "dashboard" && (
            <section className="admin-panel active" id="dashboardPanel">
              {/* Stats Counter blocks */}
              <div className="stats-grid">
                <div className="stat-card" onClick={() => setActiveTab("products")} style={{ cursor: "pointer" }}>
                  <div className="stat-icon"><i className="fa-solid fa-ring"></i></div>
                  <div className="stat-info">
                    <h3>Jewelry Products</h3>
                    <p id="statProductsCount">{productCount}</p>
                  </div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab("diamonds")} style={{ cursor: "pointer" }}>
                  <div className="stat-icon"><i className="fa-solid fa-gem"></i></div>
                  <div className="stat-info">
                    <h3>Loose Diamonds</h3>
                    <p id="statDiamondsCount">{diamondCount}</p>
                  </div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab("inquiries")} style={{ cursor: "pointer" }}>
                  <div className="stat-icon" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--color-gold)" }}><i className="fa-solid fa-envelope"></i></div>
                  <div className="stat-info">
                    <h3>Customer Inquiries</h3>
                    <p id="statInquiriesCount">{inquiries.length}</p>
                  </div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab("media")} style={{ cursor: "pointer" }}>
                  <div className="stat-icon"><i className="fa-solid fa-images"></i></div>
                  <div className="stat-info">
                    <h3>Media Library</h3>
                    <p id="statImagesCount">{imageCount}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><i className="fa-solid fa-shield-halved"></i></div>
                  <div className="stat-info">
                    <h3>Control Health</h3>
                    <p>Active</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                {/* Recent Activity Log */}
                <div className="card">
                  <div className="card-header">
                    <h2>Recent Administrative Actions</h2>
                  </div>
                  <div className="activity-log" id="dashboardLogs">
                    {logs.map((log, idx) => (
                      <div key={idx} className="activity-item">
                        <div className="activity-bullet success"></div>
                        <div className="activity-text">
                          <strong>{log.action}</strong>: {log.details}
                        </div>
                        <div className="activity-time">{log.timestamp}</div>
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <div className="activity-item">
                        <div className="activity-bullet success"></div>
                        <div className="activity-text">Secure console session started successfully.</div>
                        <div className="activity-time">Just Now</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divisions Distribution Card */}
                <div className="card">
                  <div className="card-header">
                    <h2>Division Balance</h2>
                  </div>
                  <div className="category-list" id="dashboardCategories">
                    <div className="category-item">
                      <span className="category-name">Rings</span>
                      <span className="category-count" id="countRings">{ringsCount}</span>
                    </div>
                    <div className="category-item">
                      <span className="category-name">Necklaces</span>
                      <span className="category-count" id="countNecklaces">{necklacesCount}</span>
                    </div>
                    <div className="category-item">
                      <span className="category-name">Bracelets</span>
                      <span className="category-count" id="countBracelets">{braceletsCount}</span>
                    </div>
                    <div className="category-item">
                      <span className="category-name">Earrings</span>
                      <span className="category-count" id="countEarrings">{earringsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. Jewelry Products Panel */}
          {activeTab === "products" && (
            <section className="admin-panel active" id="jewelryPanel">
              <div className="card">
                <div className="table-controls">
                  <div className="search-box">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                      type="text" 
                      id="searchJewelry" 
                      placeholder="Search jewelry products..."
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <select 
                      className="filter-select" 
                      id="filterJewelryCategory"
                      value={filterProductCat}
                      onChange={(e) => setFilterProductCat(e.target.value)}
                    >
                      <option value="all">All Divisions</option>
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="bracelets">Bracelets & Bangles</option>
                      <option value="earrings">Earrings</option>
                    </select>
                    <button className="btn btn-primary" onClick={() => handleOpenProductModal("add")}>
                      <i className="fa-solid fa-plus"></i> Add Product
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>MOQ</th>
                        <th>Pricing</th>
                        <th>Alloys</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                              <img src={formatImagePath(p.image)} className="row-img" alt="" />
                              <span className="cell-bold">{p.name}</span>
                            </div>
                          </td>
                          <td><code>{p.id}</code></td>
                          <td><span className="badge badge-outline-muted">{p.category}</span></td>
                          <td>
                            <span 
                              onClick={() => handleToggleStatus(p.id, p.name, p.isActive)}
                              style={{ 
                                background: p.isActive !== false ? "rgba(40, 199, 111, 0.12)" : "rgba(234, 84, 85, 0.12)", 
                                color: p.isActive !== false ? "#28c76f" : "#ea5455", 
                                border: p.isActive !== false ? "1px solid rgba(40, 199, 111, 0.3)" : "1px solid rgba(234, 84, 85, 0.3)", 
                                padding: "4px 10px", 
                                borderRadius: "30px", 
                                fontSize: "0.72rem", 
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                cursor: "pointer",
                                userSelect: "none",
                                display: "inline-block"
                              }}
                              title="Click to toggle catalog visibility"
                            >
                              {p.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>{p.moq}</td>
                          <td className="cell-bold">{p.fobPrice.split(" ")[0]}</td>
                          <td style={{ fontSize: "0.8rem", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {p.alloys}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="action-icon-btn edit" onClick={() => handleOpenProductModal("edit", p)} title="Edit Specs">
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button className="action-icon-btn delete" onClick={() => handleDeleteProduct(p.id, p.name)} title="Delete Product">
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>No matching jewelry products found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* 3. Loose Diamonds Panel */}
          {activeTab === "diamonds" && (
            <section className="admin-panel active" id="diamondsPanel">
              <div className="card">
                <div className="table-controls">
                  <div className="search-box">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                      type="text" 
                      id="searchDiamonds" 
                      placeholder="Search IGI certificate or name..."
                      value={searchDiamond}
                      onChange={(e) => setSearchDiamond(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <select 
                      className="filter-select" 
                      id="filterDiamondShape"
                      value={filterDiamondShape}
                      onChange={(e) => setFilterDiamondShape(e.target.value)}
                    >
                      <option value="all">All Shapes</option>
                      <option value="round">Round</option>
                      <option value="emerald">Emerald</option>
                      <option value="princess">Princess</option>
                      <option value="cushion">Cushion</option>
                      <option value="oval">Oval</option>
                      <option value="pear">Pear</option>
                      <option value="marquise">Marquise</option>
                      <option value="radiant">Radiant</option>
                      <option value="asscher">Asscher</option>
                      <option value="heart">Heart</option>
                    </select>
                    <button className="btn btn-primary" onClick={() => handleOpenDiamondModal("add")}>
                      <i className="fa-solid fa-plus"></i> Add Diamond
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Diamond Spec</th>
                        <th>Shape</th>
                        <th>Carat</th>
                        <th>Clarity</th>
                        <th>Color</th>
                        <th>Cut</th>
                        <th>Certificate</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDiamonds.map((d) => (
                        <tr key={d.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                              <img src={formatImagePath(d.image)} className="row-img" alt="" />
                              <span className="cell-bold">{d.name}</span>
                            </div>
                          </td>
                          <td style={{ textTransform: "capitalize" }}>{d.shape}</td>
                          <td className="cell-bold">{d.carat} ct</td>
                          <td>{d.clarity}</td>
                          <td>{d.color}</td>
                          <td>{d.cut}</td>
                          <td><code>{d.certificate}</code></td>
                          <td>
                            <div className="table-actions">
                              <button className="action-icon-btn edit" onClick={() => handleOpenDiamondModal("edit", d)} title="Edit Specs">
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button className="action-icon-btn delete" onClick={() => handleDeleteDiamond(d.id, d.name)} title="Delete Diamond">
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredDiamonds.length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>No matching diamonds found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* 4. Copywriting Editor Panel */}
          {activeTab === "content" && (
            <section className="admin-panel active" id="editorPanel">
              <form onSubmit={handleSaveContent}>
                {/* HOME PAGE EDITORS */}
                <div className="card" style={{ marginBottom: "2rem" }}>
                  <div className="card-header">
                    <h2>Homepage Copysheet Configurations</h2>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="form-grid">
                      <div className="form-group span-2">
                        <label className="form-label">Hero Title Banner</label>
                        <input type="text" name="home_hero_subtitle" className="form-input" defaultValue={content.home?.hero?.subtitle || ""} />
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Hero Main Title H1</label>
                        <input type="text" name="home_hero_title" className="form-input" defaultValue={content.home?.hero?.title || ""} />
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Hero Slogan Description</label>
                        <textarea name="home_hero_description" className="form-textarea" rows="3" defaultValue={content.home?.hero?.description || ""}></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WORKSHOP DETAILS */}
                <div className="card" style={{ marginBottom: "2rem" }}>
                  <div className="card-header">
                    <h2>Homepage Workshop / Atelier Copy</h2>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="form-grid">
                      <div className="form-group span-2">
                        <label className="form-label">Workshop Subtitle</label>
                        <input type="text" name="home_craft_subtitle" className="form-input" defaultValue={content.home?.craftsmanship?.subtitle || ""} />
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Workshop Title</label>
                        <input type="text" name="home_craft_title" className="form-input" defaultValue={content.home?.craftsmanship?.title || ""} />
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Paragraph Sourcing 1</label>
                        <textarea name="home_craft_desc1" className="form-textarea" rows="3" defaultValue={content.home?.craftsmanship?.description1 || ""}></textarea>
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Paragraph Sourcing 2</label>
                        <textarea name="home_craft_desc2" className="form-textarea" rows="3" defaultValue={content.home?.craftsmanship?.description2 || ""}></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ABOUT US EDITORS */}
                <div className="card" style={{ marginBottom: "2rem" }}>
                  <div className="card-header">
                    <h2>About Us Copysheet Configurations</h2>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">About Hero Subtitle</label>
                        <input type="text" name="about_hero_subtitle" className="form-input" defaultValue={content.about?.hero?.subtitle || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">About Hero Title</label>
                        <input type="text" name="about_hero_title" className="form-input" defaultValue={content.about?.hero?.title || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Philosophy Subtitle</label>
                        <input type="text" name="about_philosophy_subtitle" className="form-input" defaultValue={content.about?.philosophy?.subtitle || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Philosophy Title</label>
                        <input type="text" name="about_philosophy_title" className="form-input" defaultValue={content.about?.philosophy?.title || ""} />
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Philosophy Description 1</label>
                        <textarea name="about_philosophy_desc1" className="form-textarea" rows="3" defaultValue={content.about?.philosophy?.description1 || ""}></textarea>
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Philosophy Description 2</label>
                        <textarea name="about_philosophy_desc2" className="form-textarea" rows="3" defaultValue={content.about?.philosophy?.description2 || ""}></textarea>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Feature 1 Title</label>
                        <input type="text" name="about_philosophy_f1title" className="form-input" defaultValue={content.about?.philosophy?.feature1Title || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Feature 1 Description</label>
                        <input type="text" name="about_philosophy_f1desc" className="form-input" defaultValue={content.about?.philosophy?.feature1Desc || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Feature 2 Title</label>
                        <input type="text" name="about_philosophy_f2title" className="form-input" defaultValue={content.about?.philosophy?.feature2Title || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Feature 2 Description</label>
                        <input type="text" name="about_philosophy_f2desc" className="form-input" defaultValue={content.about?.philosophy?.feature2Desc || ""} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTACT INFO */}
                <div className="card" style={{ marginBottom: "2rem" }}>
                  <div className="card-header">
                    <h2>Showroom Contact Details</h2>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="form-grid">
                      <div className="form-group span-2">
                        <label className="form-label">Factory Address (HTML tags allowed)</label>
                        <input type="text" name="contact_address" className="form-input" defaultValue={content.contact?.info?.address || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Direct Phone</label>
                        <input type="text" name="contact_phone" className="form-input" defaultValue={content.contact?.info?.phone || ""} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Direct Email</label>
                        <input type="email" name="contact_email" className="form-input" defaultValue={content.contact?.info?.email || ""} />
                      </div>
                      <div className="form-group span-2">
                        <label className="form-label">Google Map Embed Link (iframe src URL)</label>
                        <input type="text" name="contact_map_url" className="form-input" defaultValue={content.contact?.info?.mapUrl || ""} placeholder="e.g. https://maps.google.com/maps?q=..." />
                      </div>
                    </div>
                  </div>
                </div>

                {/* GLOBAL SETTINGS & SOCIAL MEDIA */}
                <div className="card" style={{ marginBottom: "2rem" }}>
                  <div className="card-header">
                    <h2>Global Settings & Social Links</h2>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">WhatsApp Contact Number (digits only, e.g. 919427059390)</label>
                        <input type="text" name="settings_whatsapp" className="form-input" defaultValue={content.settings?.whatsappNumber || "919427059390"} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Instagram Link</label>
                        <input type="text" name="settings_instagram" className="form-input" defaultValue={content.settings?.instagram || "https://instagram.com"} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Facebook Link</label>
                        <input type="text" name="settings_facebook" className="form-input" defaultValue={content.settings?.facebook || "https://facebook.com"} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">LinkedIn Link</label>
                        <input type="text" name="settings_linkedin" className="form-input" defaultValue={content.settings?.linkedin || "https://linkedin.com"} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">YouTube Link</label>
                        <input type="text" name="settings_youtube" className="form-input" defaultValue={content.settings?.youtube || "https://youtube.com"} />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}>
                  Save Copywriting Configurations
                </button>
              </form>
            </section>
          )}

          {/* 5. Media Library Panel */}
          {activeTab === "media" && (
            <section className="admin-panel active" id="mediaPanel">
              <div className="card">
                <div style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)" }}>
                  <h2 style={{ fontSize: "1.2rem" }}>Uploaded Media Assets</h2>
                  <input
                    type="file"
                    ref={mediaInputRef}
                    onChange={(e) => handleUploadImage(e, "library")}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <button className="btn btn-secondary" onClick={() => mediaInputRef.current?.click()}>
                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Image Asset
                  </button>
                </div>
                
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.5rem" }}>
                    {images.map((img, idx) => (
                      <div key={idx} className="cert-frame" style={{ background: "var(--paper-deep)", padding: "0.8rem", borderRadius: "4px", textAlign: "center" }}>
                        <img src={formatImagePath(img.url)} style={{ height: "120px", width: "100%", objectFit: "cover", background: "#fff", marginBottom: "0.5rem" }} alt="" />
                        <code style={{ fontSize: "0.7rem", wordBreak: "break-all" }}>{img.filename}</code>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(img.url);
                            showToast("Copied!", "Relative URL copied to clipboard.");
                          }}
                          style={{ fontSize: "0.7rem", color: "var(--gold)", border: "none", cursor: "pointer", display: "block", width: "100%", marginTop: "0.5rem" }}
                        >
                          Copy path
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 6. Console Event logs Panel */}
          {activeTab === "logs" && (
            <section className="admin-panel active" id="logsPanel">
              <div className="card">
                <div className="card-header">
                  <h2>Security & Event Audit Trail</h2>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Event Context</th>
                        <th>Action Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, idx) => (
                        <tr key={idx}>
                          <td><code>{log.timestamp}</code></td>
                          <td><strong>{log.action}</strong></td>
                          <td style={{ color: "var(--ink-soft)" }}>{log.details}</td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ padding: "2rem", textAlign: "center" }}>No logs recorded in this session.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* 7. Customer Inquiries Panel */}
          {activeTab === "inquiries" && (
            <section className="admin-panel active" id="inquiriesPanel">
              <div className="card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
                <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", padding: "0 0 1rem 0" }}>
                  <h2>Submitted Wholesale & Custom Inquiries</h2>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-gold)", border: "1px solid var(--color-border)", padding: "4px 10px", borderRadius: "20px" }}>
                    Total: {inquiries.length} inquiries
                  </span>
                </div>
                
                {inquiries.length === 0 ? (
                  <div className="inquiries-empty-state" style={{ background: "var(--color-surface)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <i className="fa-solid fa-envelope-open"></i>
                    <p>No customer inquiries found.</p>
                  </div>
                ) : (
                  <div className="inquiries-grid">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="inquiry-card">
                        <div className="inquiry-header">
                          <div>
                            <h3 className="inquiry-client-name">{inq.name}</h3>
                            <p className="inquiry-client-company">{inq.company || "Independent Client"}</p>
                          </div>
                          <span className="inquiry-interest-badge">
                            {inq.interest}
                          </span>
                        </div>

                        <div className="inquiry-meta-row">
                          <div className="inquiry-meta-item">
                            <span>Date Received</span>
                            <strong>{new Date(inq.created_at).toLocaleString()}</strong>
                          </div>
                          {inq.volume && (
                            <div className="inquiry-meta-item">
                              <span>Est. Volume</span>
                              <strong>{inq.volume}</strong>
                            </div>
                          )}
                        </div>

                        <div className="inquiry-message-container">
                          <span>Inquiry Message</span>
                          <div className="inquiry-message-box">
                            {inq.message}
                          </div>
                        </div>

                        <div className="inquiry-contacts">
                          <div className="inquiry-contact-item">
                            <i className="fa-solid fa-envelope"></i>
                            <a href={`mailto:${inq.email}`}>{inq.email}</a>
                          </div>
                          {inq.phone && (
                            <div className="inquiry-contact-item">
                              <i className="fa-solid fa-phone"></i>
                              <a href={`tel:${inq.phone}`}>{inq.phone}</a>
                            </div>
                          )}
                        </div>

                        <div className="inquiry-actions">
                          {inq.phone && (
                            <button 
                              onClick={() => {
                                const cleanPhone = inq.phone.replace(/\D/g, "");
                                const msg = encodeURIComponent(`Hi ${inq.name}, this is Aurelia Jewelry Exports. We received your business inquiry regarding ${inq.interest}.`);
                                window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
                              }}
                              className="btn btn-secondary inquiry-chat-btn" 
                              title="Chat on WhatsApp"
                            >
                              <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                            </button>
                          )}
                          <button 
                            onClick={async () => {
                              if (!confirm("Are you sure you want to delete this customer inquiry?")) return;
                              try {
                                const res = await fetch(`/api/inquiries/${inq.id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (data.success) {
                                  setInquiries(prev => prev.filter(item => item.id !== inq.id));
                                  showToast("Success", "Inquiry deleted successfully.");
                                }
                              } catch (e) {
                                showToast("Error", "Failed to delete inquiry.");
                              }
                            }}
                            className="btn btn-danger inquiry-delete-btn" 
                            title="Delete Record"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Reusable Toast success modal */}
      <SuccessModal
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        title={toastTitle}
        text={toastText}
      />

      {/* CRUD Modal A: Product Editor */}
      {productModal.open && (
        <div className="modal-backdrop active" id="jewelryModalBackdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{productModal.type === "add" ? "Add Jewelry Product" : "Modify Product Specs"}</h3>
              <button className="modal-close-btn" onClick={() => setProductModal({ open: false, type: "add", data: null })}>&times;</button>
            </div>
            <form id="jewelryForm" onSubmit={handleSaveProduct}>
              <div className="modal-body">
                <div className="form-grid">

                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wholesale Solitaire Rings"
                      className="form-input"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select-ctrl"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="bracelets">Bracelets & Bangles</option>
                      <option value="earrings">Earrings</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Catalog Visibility Status *</label>
                    <select
                      className="form-select-ctrl"
                      value={productForm.isActive !== false ? "active" : "inactive"}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.value === "active" })}
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                    </select>
                  </div>


                  <div className="form-group span-2">
                    <label className="form-label">Gemstones & Settings Specifications *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IGI Certified Round Brilliant Diamonds"
                      className="form-input"
                      value={productForm.gemstones}
                      onChange={(e) => setProductForm({ ...productForm, gemstones: e.target.value })}
                    />
                  </div>
                  <div className="form-group span-2">
                    <label className="form-label">FOB Price Range *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Starting at $1,250 / unit"
                      className="form-input"
                      value={productForm.fobPrice}
                      onChange={(e) => setProductForm({ ...productForm, fobPrice: e.target.value })}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label className="form-label">Marketing Catalog Description *</label>
                    <textarea
                      required
                      className="form-textarea"
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="form-group span-2">
                    <label className="form-label">Upload Showcase Image</label>
                    <div className="image-upload-wrapper">
                      <i className="fa-solid fa-cloud-arrow-up image-upload-icon"></i>
                      <div className="image-upload-text"><b>Upload</b> main catalog image from device</div>
                      <input 
                        type="file" 
                        className="image-upload-input" 
                        onChange={(e) => handleUploadImage(e, "product")}
                      />
                      {productForm.image && (
                        <div className="image-upload-preview" style={{ display: "block" }}>
                          <img src={formatImagePath(productForm.image)} alt="Showcase Preview" />
                        </div>
                      )}
                    </div>
                  </div>


                  {/* Multiple Gallery Images */}
                  <div className="form-group span-2" style={{ borderTop: "1px dashed var(--color-border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
                    <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Product Gallery Images ({productForm.gallery?.length || 0})</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-gold)", textTransform: "none" }}>These are additional angles shown on the details page.</span>
                    </label>
                    
                    {/* Visual Grid of current gallery images with delete icon */}
                    {productForm.gallery && productForm.gallery.length > 0 && (
                      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                        {productForm.gallery.map((img, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              position: "relative", 
                              width: "80px", 
                              height: "80px", 
                              border: "1px solid var(--color-border)", 
                              borderRadius: "4px",
                              padding: "4px",
                              background: "rgba(255,255,255,0.05)"
                            }}
                          >
                            <img src={formatImagePath(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm((prev) => ({
                                  ...prev,
                                  gallery: prev.gallery.filter((_, i) => i !== idx),
                                }));
                              }}
                              style={{
                                position: "absolute",
                                top: "-5px",
                                right: "-5px",
                                background: "var(--color-error)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: "bold"
                              }}
                              title="Remove image from gallery"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="image-upload-wrapper" style={{ minHeight: "80px", padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa-solid fa-images image-upload-icon" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}></i>
                      <div className="image-upload-text" style={{ fontSize: "0.8rem" }}>
                        Click to <b>upload gallery images</b> (select multiple files)
                      </div>
                      <input 
                        type="file" 
                        className="image-upload-input" 
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          const uploadedPaths = [];
                          for (const file of files) {
                            const formData = new FormData();
                            formData.append("image", file);
                            try {
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                body: formData,
                              });
                              const data = await res.json();
                              if (data.success) {
                                uploadedPaths.push(data.filepath);
                              }
                            } catch (err) {
                              console.error("Gallery file upload failure", err);
                            }
                          }
                          if (uploadedPaths.length > 0) {
                            setProductForm((prev) => ({
                              ...prev,
                              gallery: [...(prev.gallery || []), ...uploadedPaths],
                            }));
                            showToast("Uploaded", `Added ${uploadedPaths.length} image(s) to catalog gallery.`);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setProductModal({ open: false, type: "add", data: null })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Modal B: Diamond Editor */}
      {diamondModal.open && (
        <div className="modal-backdrop active" id="diamondModalBackdrop">
          <div className="modal" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="modal-header">
              <h3>{diamondModal.type === "add" ? "Add Diamond Spec" : "Modify Diamond Specs"}</h3>
              <button className="modal-close-btn" onClick={() => setDiamondModal({ open: false, type: "add", data: null })}>&times;</button>
            </div>
            <form id="diamondForm" onSubmit={handleSaveDiamond}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Diamond Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3.05ct Round Brilliant"
                      className="form-input"
                      value={diamondForm.name}
                      onChange={(e) => setDiamondForm({ ...diamondForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Carat Weight *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 3.05"
                      className="form-input"
                      value={diamondForm.carat}
                      onChange={(e) => setDiamondForm({ ...diamondForm, carat: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shape *</label>
                    <select
                      className="form-select-ctrl"
                      value={diamondForm.shape}
                      onChange={(e) => setDiamondForm({ ...diamondForm, shape: e.target.value })}
                    >
                      <option value="round">Round</option>
                      <option value="emerald">Emerald</option>
                      <option value="princess">Princess</option>
                      <option value="cushion">Cushion</option>
                      <option value="oval">Oval</option>
                      <option value="pear">Pear</option>
                      <option value="marquise">Marquise</option>
                      <option value="radiant">Radiant</option>
                      <option value="asscher">Asscher</option>
                      <option value="heart">Heart</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cut Grade *</label>
                    <select
                      className="form-select-ctrl"
                      value={diamondForm.cut}
                      onChange={(e) => setDiamondForm({ ...diamondForm, cut: e.target.value })}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Clarity Grade *</label>
                    <select
                      className="form-select-ctrl"
                      value={diamondForm.clarity}
                      onChange={(e) => setDiamondForm({ ...diamondForm, clarity: e.target.value })}
                    >
                      <option value="FL">FL (Flawless)</option>
                      <option value="IF">IF (Internally Flawless)</option>
                      <option value="VVS1">VVS1</option>
                      <option value="VVS2">VVS2</option>
                      <option value="VS1">VS1</option>
                      <option value="VS2">VS2</option>
                      <option value="SI1">SI1</option>
                      <option value="SI2">SI2</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color Grade *</label>
                    <select
                      className="form-select-ctrl"
                      value={diamondForm.color}
                      onChange={(e) => setDiamondForm({ ...diamondForm, color: e.target.value })}
                    >
                      <option value="D">D (Colorless)</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                      <option value="G">G (Near Colorless)</option>
                      <option value="H">H</option>
                      <option value="I">I</option>
                      <option value="J">J</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">IGI Certificate Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IGI #8293049182"
                      className="form-input"
                      value={diamondForm.certificate}
                      onChange={(e) => setDiamondForm({ ...diamondForm, certificate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Measurements *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 8.12 x 5.92 x 3.65 mm"
                      className="form-input"
                      value={diamondForm.measurements}
                      onChange={(e) => setDiamondForm({ ...diamondForm, measurements: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Table Width %</label>
                    <input
                      type="text"
                      placeholder="e.g. 57%"
                      className="form-input"
                      value={diamondForm.table}
                      onChange={(e) => setDiamondForm({ ...diamondForm, table: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Depth %</label>
                    <input
                      type="text"
                      placeholder="e.g. 61.8%"
                      className="form-input"
                      value={diamondForm.depth}
                      onChange={(e) => setDiamondForm({ ...diamondForm, depth: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Polish Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. Excellent"
                      className="form-input"
                      value={diamondForm.polish}
                      onChange={(e) => setDiamondForm({ ...diamondForm, polish: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Symmetry Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. Excellent"
                      className="form-input"
                      value={diamondForm.symmetry}
                      onChange={(e) => setDiamondForm({ ...diamondForm, symmetry: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fluorescence Intensity</label>
                    <input
                      type="text"
                      placeholder="e.g. None"
                      className="form-input"
                      value={diamondForm.fluorescence}
                      onChange={(e) => setDiamondForm({ ...diamondForm, fluorescence: e.target.value })}
                    />
                  </div>
                  <div className="form-group span-2">
                    <label className="form-label">Diamond Image Source</label>
                    <select
                      className="form-select-ctrl"
                      value={["images/diamond-round.png", "images/diamond-emerald.png", "images/diamond-princess.png"].includes(diamondForm.image) ? diamondForm.image : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          setDiamondForm({ ...diamondForm, image: e.target.value });
                        }
                      }}
                      style={{ marginBottom: "1rem" }}
                    >
                      <option value="images/diamond-round.png">Round/Brilliant Render Icon</option>
                      <option value="images/diamond-emerald.png">Emerald/Rectangular Render Icon</option>
                      <option value="images/diamond-princess.png">Princess/Square Render Icon</option>
                      {!["images/diamond-round.png", "images/diamond-emerald.png", "images/diamond-princess.png"].includes(diamondForm.image) && (
                        <option value="custom">Custom Uploaded Image</option>
                      )}
                    </select>
                    
                    <div className="image-upload-wrapper">
                      <i className="fa-solid fa-cloud-arrow-up image-upload-icon"></i>
                      <div className="image-upload-text"><b>Upload</b> custom stone image or cert photo from device</div>
                      <input 
                        type="file" 
                        className="image-upload-input" 
                        onChange={(e) => handleUploadImage(e, "diamond")}
                      />
                      {diamondForm.image && (
                        <div className="image-upload-preview" style={{ display: "block" }}>
                          <img src={formatImagePath(diamondForm.image)} alt="Diamond Preview" />
                          <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                            Current image: <code>{diamondForm.image}</code>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multiple Gallery Images for Diamonds */}
                  <div className="form-group span-2" style={{ borderTop: "1px dashed var(--color-border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
                    <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Diamond Gallery Images ({diamondForm.gallery?.length || 0})</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-gold)", textTransform: "none" }}>These are additional angles/photos shown on the details page.</span>
                    </label>
                    
                    {/* Visual Grid of current gallery images with delete icon */}
                    {diamondForm.gallery && diamondForm.gallery.length > 0 && (
                      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                        {diamondForm.gallery.map((img, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              position: "relative", 
                              width: "80px", 
                              height: "80px", 
                              border: "1px solid var(--color-border)", 
                              borderRadius: "4px",
                              padding: "4px",
                              background: "rgba(255,255,255,0.05)"
                            }}
                          >
                            <img src={formatImagePath(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                            <button
                              type="button"
                              onClick={() => {
                                setDiamondForm((prev) => ({
                                  ...prev,
                                  gallery: prev.gallery.filter((_, i) => i !== idx),
                                }));
                              }}
                              style={{
                                position: "absolute",
                                top: "-5px",
                                right: "-5px",
                                background: "var(--color-error)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: "bold"
                              }}
                              title="Remove image from gallery"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="image-upload-wrapper" style={{ minHeight: "80px", padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa-solid fa-images image-upload-icon" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}></i>
                      <div className="image-upload-text" style={{ fontSize: "0.8rem" }}>
                        Click to <b>upload gallery images</b> (select multiple files)
                      </div>
                      <input 
                        type="file" 
                        className="image-upload-input" 
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          const uploadedPaths = [];
                          for (const file of files) {
                            const formData = new FormData();
                            formData.append("image", file);
                            try {
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                body: formData,
                              });
                              const data = await res.json();
                              if (data.success) {
                                uploadedPaths.push(data.filepath);
                              }
                            } catch (err) {
                              console.error("Gallery file upload failure", err);
                            }
                          }
                          if (uploadedPaths.length > 0) {
                            setDiamondForm((prev) => ({
                              ...prev,
                              gallery: [...(prev.gallery || []), ...uploadedPaths],
                            }));
                            showToast("Uploaded", `Added ${uploadedPaths.length} image(s) to diamond gallery.`);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group span-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={diamondForm.isNew} 
                        onChange={(e) => setDiamondForm({ ...diamondForm, isNew: e.target.checked })} 
                      /> New
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={diamondForm.isFeatured} 
                        onChange={(e) => setDiamondForm({ ...diamondForm, isFeatured: e.target.checked })} 
                      /> Featured
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={diamondForm.isRare} 
                        onChange={(e) => setDiamondForm({ ...diamondForm, isRare: e.target.checked })} 
                      /> Rare
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={diamondForm.isInvestment} 
                        onChange={(e) => setDiamondForm({ ...diamondForm, isInvestment: e.target.checked })} 
                      /> Investment
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setDiamondModal({ open: false, type: "add", data: null })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Diamond
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
