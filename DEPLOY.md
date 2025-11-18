# 🚀 AJI SUSHI - 直接部署上线指南

## ✅ 这个包可以直接部署到全世界访问！

---

## 🎯 **方法1：Vercel 部署（最推荐！免费！）**

### **步骤：**

#### 1. **注册 Vercel 账号**
- 访问：https://vercel.com/signup
- 使用 GitHub/GitLab/Email 注册（免费）

#### 2. **上传代码到 GitHub**

**方式A：使用 GitHub 网页（简单）**

1. 访问：https://github.com/new
2. 仓库名：`aji-sushi-ordering`
3. 设为 **Public**
4. ✅ 勾选 "Add a README file"
5. 点击 "Create repository"
6. 点击 "uploading an existing file"
7. **将此文件夹中的所有文件拖进去**
8. 点击 "Commit changes"

**方式B：使用 Git 命令行（如果您熟悉）**

```bash
cd vercel-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aji-sushi-ordering.git
git push -u origin main
```

#### 3. **在 Vercel 部署**

1. 访问：https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择您刚创建的 `aji-sushi-ordering` 仓库
4. 点击 "Import"
5. **保持默认设置**，直接点击 "Deploy"
6. 等待 2-3 分钟...
7. **完成！** 您会获得一个网址！

**您的网站：**
```
https://aji-sushi-ordering.vercel.app
```

或类似的网址！

---

## 🎯 **方法2：Netlify 部署（也很简单！）**

#### 1. **注册 Netlify 账号**
- 访问：https://app.netlify.com/signup
- 使用 GitHub/Email 注册（免费）

#### 2. **准备代码**

**方式A：通过 GitHub（推荐）**
1. 先上传到 GitHub（参考上面方法1的步骤2）
2. 在 Netlify 点击 "New site from Git"
3. 选择 GitHub
4. 选择您的仓库
5. Build 设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击 "Deploy site"

**方式B：拖拽上传**
1. **在本地先构建：**
   ```bash
   cd vercel-deploy
   npm install
   npm run build
   ```
2. 访问：https://app.netlify.com/drop
3. 将生成的 `dist` 文件夹拖进去
4. 完成！

---

## 🎯 **方法3：使用 Vercel CLI（最快！）**

如果您的电脑已安装 Node.js：

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 进入项目目录
cd vercel-deploy

# 3. 安装依赖
npm install

# 4. 部署！
vercel --prod
```

跟着提示操作，完成！

---

## 📊 **部署后您会获得：**

✅ **一个永久的网址**，例如：
- `https://aji-sushi-ordering.vercel.app`
- 或 `https://your-site.netlify.app`

✅ **全世界都能访问**

✅ **自动 HTTPS 安全证书**

✅ **免费托管**

✅ **自动 CDN 加速**

---

## 🔧 **自定义域名（可选）**

部署后，您可以：

1. 在 Vercel/Netlify 控制面板
2. 点击 "Domains"
3. 添加您自己的域名（如 `www.ajisushi.com`）
4. 按照提示配置 DNS

---

## ✅ **功能清单：**

您的网站包含：

### **客户端：**
- ✅ 完整菜单展示
- ✅ 购物车功能
- ✅ 在线下单
- ✅ 页眉居中显示
- ✅ 分类滚动

### **管理员后台：**
- ✅ 订单管理
- ✅ 菜单管理
- ✅ 套餐系统（可自定义标题）
- ✅ 密码修改
- ✅ SEO设置
- ✅ 餐厅信息管理

**默认管理员密码：** `admin123`

---

## 🆘 **需要帮助？**

### **常见问题：**

**Q: 构建失败怎么办？**
A: 确保所有文件都上传了，特别是 `package.json` 和 `src/App.tsx`

**Q: 网站显示空白？**
A: 等待几分钟让 CDN 更新

**Q: 如何更新网站？**
A: 
- 通过 GitHub：提交新代码，自动重新部署
- 通过拖拽：重新拖拽新的 dist 文件夹

**Q: 费用是多少？**
A: Vercel 和 Netlify 的免费套餐完全够用！

---

## 🎉 **恭喜！**

按照上面任意一个方法，您的订餐系统就上线了！

**推荐顺序：**
1. 🥇 Vercel（最简单）
2. 🥈 Netlify（也很简单）
3. 🥉 Vercel CLI（最快）

---

## 📞 **下一步：**

1. ✅ 部署网站
2. ✅ 获取网址
3. ✅ 登录后台修改餐厅信息
4. ✅ 添加您的菜单
5. ✅ 分享给客户
6. ✅ 开始接单！

**祝生意兴隆！** 🍣✨
