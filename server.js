import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "data", "store.json");
const port = Number(process.env.PORT || 4000);
const secret = process.env.JWT_SECRET || "local-demo-change-me-before-production";
const adminEmail = process.env.ADMIN_EMAIL || "admin@nexora.local";
const adminPassword = process.env.ADMIN_PASSWORD || "muradnagar";

app.use(cors({ origin: true }));
app.use(express.json({ limit: "100kb" }));

const baseProducts = [
  ["Aero Carry","Travel",4990,"Carbon","https://images.unsplash.com/photo-1553531889-56f3f7f68b82?auto=format&fit=crop&w=900&q=85","Bestseller"],
  ["Solis Table Lamp","Home",2890,"Amber","https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85","New"],
  ["Form Bottle","Daily",1290,"Sage","https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",""],
  ["Mono Headphones","Tech",7990,"Sand","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85","-16%"],
  ["Runline Pro","Shoes",6490,"Cloud white","https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85","New"],
  ["Urban Trail","Shoes",5890,"Slate","https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85",""],
  ["Wander Sling","Bags",3290,"Cocoa","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",""],
  ["Canvas Weekender","Bags",6990,"Olive","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85","Popular"],
  ["Terra Flask","Daily",1590,"Ocean","https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",""],
  ["Hydra Steel","Daily",1890,"Ink","https://images.unsplash.com/photo-1526401485004-2fda9f6e1d58?auto=format&fit=crop&w=900&q=85",""],
  ["Nova One","Phones",42990,"Midnight","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85","New"],
  ["Pixel Frame","Phones",31990,"Mist","https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85",""],
  ["Orbit Case","Phones",890,"Sunset","https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=85",""],
  ["Chef's Skillet","Kitchen",3790,"Black","https://images.unsplash.com/photo-1583778176476-4a8b02f8e15d?auto=format&fit=crop&w=900&q=85",""],
  ["Mori Knife Set","Kitchen",5290,"Steel","https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=900&q=85","Bestseller"],
  ["Pour Over Kit","Kitchen",2390,"Cream","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",""],
  ["Serein Serum","Beauty",1890,"Vitamin C","https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85","New"],
  ["Dew Moisturiser","Beauty",1490,"Cloud","https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85",""],
  ["Velvet Lip Tint","Beauty",990,"Rosewood","https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",""],
  ["Arc Timepiece","Daily",5690,"Gold","https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",""],
  ["Linen Throw","Home",3490,"Natural","https://images.unsplash.com/photo-1600369672770-985fd30004eb?auto=format&fit=crop&w=900&q=85",""],
  ["Cloud Cushion","Home",2190,"Ivory","https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85",""],
  ["Tune Mini","Tech",4990,"Graphite","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",""],
  ["Alto Speaker","Tech",6290,"Silver","https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",""],
  ["Motion Mat","Daily",2390,"Clay","https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=85",""],
  ["Drift Slides","Shoes",2290,"Moss","https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=85",""],
  ["Studio Tote","Bags",2690,"Ecru","https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",""],
  ["Snap Mug","Kitchen",1190,"Cobalt","https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",""],
  ["Quiet Night Oil","Beauty",1790,"Lavender","https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85",""],
  ["Weekender Pouch","Bags",1490,"Terracotta","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",""],
  ["Brew Scale","Kitchen",1990,"Charcoal","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",""],
  ["Cove Sandals","Shoes",3590,"Tan","https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=85",""],
  ["Prism Charger","Tech",2290,"White","https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=85",""],
  ["Soft Focus SPF","Beauty",1290,"SPF 50","https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85",""],
];
const productFromSeed = (item, index) => ({ id: `p-${index + 1}`, name:item[0], category:item[1], price:item[2], color:item[3], image:item[4], tag:item[5] || undefined, rating:Number((4.5 + (index % 5) / 10).toFixed(1)), available:true, stock: 5 + (index * 7) % 34 });
function load() { if (!existsSync(DATA_FILE)) { mkdirSync(dirname(DATA_FILE), { recursive:true }); const db = { users:[], products:baseProducts.map(productFromSeed), orders:[], announcement:"✨ Fresh finds are here — complimentary shipping over ₹1,999.", nextOrder:1001 }; writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); return db; } return JSON.parse(readFileSync(DATA_FILE, "utf8")); }
function save(db) { writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); }
function requireAdmin(req,res,next) { const token = req.headers.authorization?.replace("Bearer ", ""); try { const payload = jwt.verify(token, secret); if (payload.role !== "admin") throw new Error(); req.user=payload; next(); } catch { res.status(401).json({ error:"Admin access required" }); } }
app.get("/api/products", (_,res) => { const db=load(); res.json(db.products); });
app.get("/api/announcement", (_,res) => res.json({ message:load().announcement }));
app.post("/api/orders", (req,res) => { const { customer, items, paymentMethod="upi" } = req.body; if (!customer?.name || !customer?.email || !customer?.phone || !Array.isArray(items) || !items.length) return res.status(400).json({ error:"Name, email, phone and order items are required." }); const db=load(); const normalized=items.map(({ id, quantity }) => { const p=db.products.find(x=>x.id===id && x.available); return p && { id:p.id,name:p.name,image:p.image,price:p.price,quantity:Math.max(1,Number(quantity)||1) }; }).filter(Boolean); if (!normalized.length) return res.status(400).json({ error:"Selected products are unavailable." }); const subtotal=normalized.reduce((s,i)=>s+i.price*i.quantity,0); const order={ id:`NX-${db.nextOrder++}`, customer:{ name:customer.name.trim(), email:customer.email.trim().toLowerCase(), phone:customer.phone.trim(), address:(customer.address||"").trim() }, items:normalized, subtotal, shipping:subtotal>=1999?0:99, total:subtotal+(subtotal>=1999?0:99), paymentMethod, paymentStatus:"demo_paid", status:"Order received", timeline:[{ status:"Order received", at:new Date().toISOString(), note:"Your order has been confirmed." }], createdAt:new Date().toISOString() }; db.orders.unshift(order); let user=db.users.find(u=>u.email===order.customer.email); if(!user){ user={ id:`u-${db.users.length+1}`, ...order.customer, createdAt:new Date().toISOString() }; db.users.push(user); } normalized.forEach(item=>{const p=db.products.find(x=>x.id===item.id); p.stock=Math.max(0,p.stock-item.quantity); if(!p.stock) p.available=false;}); save(db); res.status(201).json(order); });
app.get("/api/orders/:id", (req,res) => { const order=load().orders.find(o=>o.id.toLowerCase()===req.params.id.toLowerCase()); return order ? res.json(order) : res.status(404).json({ error:"We couldn't find that order." }); });
app.post("/api/admin/login", async (req,res) => { const { email,password }=req.body; if(email!==adminEmail || password!==adminPassword) return res.status(401).json({error:"Incorrect email or password."}); const token=jwt.sign({role:"admin",email},secret,{expiresIn:"8h"}); res.json({token,email}); });
app.get("/api/admin/dashboard", requireAdmin, (_,res) => { const db=load(); res.json({ products:db.products, orders:db.orders, users:db.users, announcement:db.announcement }); });
app.post("/api/admin/products", requireAdmin, (req,res) => { const { name,category,price,color,image,stock }=req.body; if(!name||!category||!price) return res.status(400).json({error:"Name, category and price are required."}); const db=load(); const product={ id:`p-${Date.now()}`, name, category, price:Number(price), color:color||"Default", image:image||"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85", rating:4.8, available:true, stock:Number(stock)||0, tag:"New"}; db.products.unshift(product); save(db); res.status(201).json(product); });
app.patch("/api/admin/products/:id", requireAdmin, (req,res) => { const db=load(); const product=db.products.find(p=>p.id===req.params.id); if(!product) return res.status(404).json({error:"Product not found"}); Object.assign(product, req.body, { price:req.body.price===undefined?product.price:Number(req.body.price), stock:req.body.stock===undefined?product.stock:Number(req.body.stock) }); if(product.stock<=0) product.available=false; save(db); res.json(product); });
app.delete("/api/admin/products/:id", requireAdmin, (req,res) => { const db=load(); db.products=db.products.filter(p=>p.id!==req.params.id); save(db); res.status(204).end(); });
app.patch("/api/admin/orders/:id", requireAdmin, (req,res) => { const db=load(); const order=db.orders.find(o=>o.id===req.params.id); if(!order) return res.status(404).json({error:"Order not found"}); const status=String(req.body.status||"").slice(0,80); if(!status) return res.status(400).json({error:"Status required"}); order.status=status; order.timeline.push({status,at:new Date().toISOString(),note:req.body.note?.slice(0,140)||"Order update from Nexora."}); save(db); res.json(order); });
app.patch("/api/admin/announcement", requireAdmin, (req,res) => { const db=load(); db.announcement=String(req.body.message||"").slice(0,180); save(db); res.json({message:db.announcement}); });
load();
app.listen(port, () => console.log(`Nexora API running at http://localhost:${port}`));
