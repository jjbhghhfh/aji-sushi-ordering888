import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Plus, Minus, Edit, Trash2, Clock, Phone, MapPin, DollarSign, Printer, Settings, Search, Home, Lock, Bell, Check, AlertCircle, ArrowUp, ArrowDown, Globe, FileText, Package } from 'lucide-react';
import { firebaseDB } from './firebase';

const AjiSushiOrdering = () => {
  const [view, setView] = useState('customer');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // 新增：订单等待确认状态
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState(null);
  const [customerOrderId, setCustomerOrderId] = useState(null);

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'AJI SUSHI',
    tagline: 'Authentic Japanese Cuisine',
    phone: '8452786333',
    address: '1620 ny-22 brewster, ny, 10509',
    email: 'ajidiysushi@gmail.com',
    hours: {
      monday: 'Close',
      tuesday: '11:00 AM - 9:00 PM',
      wednesday: '11:00 AM - 9:00 PM',
      thursday: '11:00 AM - 9:00 PM',
      friday: '11:00 AM - 9:00 PM',
      saturday: '12:00 PM - 9:00 PM',
      sunday: '12:00 PM - 8:30 PM'
    }
  });

  // SEO设置
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'AJI SUSHI - Authentic Japanese Cuisine',
    metaDescription: 'Order fresh sushi, sashimi, and Japanese dishes online. Best sushi in town!',
    metaKeywords: 'sushi, japanese food, sashimi, rolls, online ordering',
    ogTitle: 'AJI SUSHI - Order Online',
    ogDescription: 'Fresh and authentic Japanese cuisine delivered to your door',
    ogImage: ''
  });

  const [menuCategories, setMenuCategories] = useState([
    { id: 1, name: 'Appetizers', description: 'Start your meal with our delicious appetizers', order: 1 },
    { id: 2, name: 'Sushi Rolls', description: 'Freshly made sushi rolls', order: 2 },
    { id: 3, name: 'Nigiri', description: 'Traditional nigiri sushi', order: 3 },
    { id: 4, name: 'Sashimi', description: 'Premium sliced raw fish', order: 4 },
    { id: 5, name: 'Entrees', description: 'Main course dishes', order: 5 },
    { id: 6, name: 'Beverages', description: 'Drinks and refreshments', order: 6 },
    { id: 7, name: 'Desserts', description: 'Sweet endings', order: 7 }
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Edamame', category: 'Appetizers', price: 5.95, description: 'Steamed soybeans with sea salt', image: '🫘', available: true, tags: ['Vegetarian'], type: 'regular' },
    { id: 2, name: 'Gyoza', category: 'Appetizers', price: 7.95, description: 'Pan-fried pork dumplings (6 pcs)', image: '🥟', available: true, tags: [], type: 'regular' },
    { id: 3, name: 'Miso Soup', category: 'Appetizers', price: 3.95, description: 'Traditional soybean paste soup', image: '🍲', available: true, tags: ['Vegetarian'], type: 'regular' },
    { id: 6, name: 'California Roll', category: 'Sushi Rolls', price: 8.95, description: 'Crab, avocado, cucumber', image: '🍣', available: true, tags: [], type: 'regular' },
    { id: 7, name: 'Spicy Tuna Roll', category: 'Sushi Rolls', price: 9.95, description: 'Spicy tuna, cucumber, sriracha', image: '🍣', available: true, tags: ['Spicy'], type: 'regular' },
    { id: 8, name: 'Philadelphia Roll', category: 'Sushi Rolls', price: 10.95, description: 'Salmon, cream cheese, cucumber', image: '🍣', available: true, tags: [], type: 'regular' },
    { id: 9, name: 'Rainbow Roll', category: 'Sushi Rolls', price: 14.95, description: 'California roll topped with fish', image: '🍣', available: true, tags: [], type: 'regular' },
    { id: 13, name: 'Salmon Nigiri', category: 'Nigiri', price: 6.95, description: 'Fresh salmon over rice (2 pcs)', image: '🍣', available: true, tags: [], type: 'regular' },
    { id: 14, name: 'Tuna Nigiri', category: 'Nigiri', price: 7.50, description: 'Bluefin tuna over rice (2 pcs)', image: '🍣', available: true, tags: [], type: 'regular' },
    { id: 21, name: 'Chicken Teriyaki', category: 'Entrees', price: 14.95, description: 'Grilled chicken with teriyaki', image: '🍗', available: true, tags: [], type: 'regular' },
    { id: 22, name: 'Beef Teriyaki', category: 'Entrees', price: 16.95, description: 'Grilled beef with teriyaki', image: '🥩', available: true, tags: [], type: 'regular' },
    { id: 27, name: 'Green Tea', category: 'Beverages', price: 2.95, description: 'Hot or iced green tea', image: '🍵', available: true, tags: [], type: 'regular' },
    { id: 31, name: 'Mochi Ice Cream', category: 'Desserts', price: 5.95, description: 'Rice cake ice cream (3 pcs)', image: '🍡', available: true, tags: [], type: 'regular' }
  ]);

  const [availableTags, setAvailableTags] = useState(['Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy', 'Chef Special']);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemNotes, setItemNotes] = useState('');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    orderType: 'pickup',
    notes: ''
  });

  const [editingItem, setEditingItem] = useState(null);
  const [adminTab, setAdminTab] = useState('orders');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Appetizers',
    price: '',
    description: '',
    image: '🍱',
    available: true,
    type: 'regular',
    comboConfig: {
      requiredSelections: 3,
      availableItems: [],
      soupOptions: [],
      saladOptions: [],
      mainItemsLabel: 'Available Items for Selection',
      soupLabel: 'Soup Options',
      saladLabel: 'Salad Options'
    }
  });

  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [prepTime, setPrepTime] = useState('');
  const [hasUnconfirmedOrders, setHasUnconfirmedOrders] = useState(false);
  
  // 新增：分类编辑
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingRestaurantInfo, setEditingRestaurantInfo] = useState(false);
  
  // 新增：套餐选择状态
  const [comboSelections, setComboSelections] = useState({
    selectedItems: [],
    selectedSoup: null,
    selectedSalad: null
  });
  
  // 新增：修改密码状态
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const categoryRefs = useRef({});

  const TAX_RATE = 0.08375;

  // 监听订单确认状态
  useEffect(() => {
    if (customerOrderId) {
      const order = orders.find(o => o.id === customerOrderId);
      if (order && order.status === 'confirmed') {
        setConfirmedOrderDetails(order);
        setWaitingForConfirmation(false);
      }
    }
  }, [orders, customerOrderId]);

  useEffect(() => {
    const unconfirmed = orders.some(o => o.status === 'pending');
    setHasUnconfirmedOrders(unconfirmed);
    
    if (unconfirmed && isAdminAuthenticated && view === 'admin') {
      if (!isPlaying) {
        playNotificationSound();
      }
    } else {
      stopNotificationSound();
    }
  }, [orders, isAdminAuthenticated, view]);

  const playNotificationSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBellSound = () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.value = 0;
        
        const now = audioContext.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
      };
      
      const interval = setInterval(() => {
        if (hasUnconfirmedOrders && isAdminAuthenticated && view === 'admin') {
          playBellSound();
        }
      }, 1000);
      
      audioRef.current = { interval, audioContext };
    }
    setIsPlaying(true);
  };

  const stopNotificationSound = () => {
    if (audioRef.current && audioRef.current.interval) {
      clearInterval(audioRef.current.interval);
      if (audioRef.current.audioContext) {
        audioRef.current.audioContext.close();
      }
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  
  const handleComboItemToggle = (item) => {
    const isSelected = comboSelections.selectedItems.some(i => i.id === item.id);
    const required = selectedItem.comboConfig.requiredSelections;
    
    if (isSelected) {
      setComboSelections({
        ...comboSelections,
        selectedItems: comboSelections.selectedItems.filter(i => i.id !== item.id)
      });
    } else {
      if (comboSelections.selectedItems.length < required) {
        setComboSelections({
          ...comboSelections,
          selectedItems: [...comboSelections.selectedItems, item]
        });
      } else {
        alert(`You can only select ${required} items for this combo.`);
      }
    }
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setItemNotes('');
    if (item.type === 'combo') {
      setComboSelections({
        selectedItems: [],
        selectedSoup: null,
        selectedSalad: null
      });
    }
  };

  const addToCart = () => {
    if (!selectedItem) return;
    setCart([...cart, {
      ...selectedItem,
      quantity: itemQuantity,
      specialNotes: itemNotes,
      cartId: Date.now()
    }]);
    setSelectedItem(null);
    setItemQuantity(1);
    setItemNotes('');
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + tax;

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        
        // Load menu items
        const items = await firebaseDB.getMenuItems();
        if (items.length > 0) {
          setMenuItems(items);
        }
        
        // Load orders
        const ordersData = await firebaseDB.getOrders();
        if (ordersData.length > 0) {
          setOrders(ordersData);
        }
        
        // Load categories
        const categoriesData = await firebaseDB.getCategories();
        if (categoriesData.length > 0) {
          setMenuCategories(categoriesData);
        }
        
        // Load restaurant info
        const restaurantData = await firebaseDB.getRestaurantInfo();
        if (restaurantData) {
          setRestaurantInfo(restaurantData);
        }
        
        setIsLoadingData(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoadingData(false);
      }
    };
    
    loadData();
    
    // Set up real-time listeners
    const unsubscribeMenu = firebaseDB.onMenuItemsChange((items) => {
      setMenuItems(items);
    });
    
    const unsubscribeOrders = firebaseDB.onOrdersChange((ordersData) => {
      setOrders(ordersData);
    });
    
    // Cleanup listeners
    return () => {
      unsubscribeMenu();
      unsubscribeOrders();
    };
  }, []);

  
  const scrollToCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName !== 'All' && categoryRefs.current[categoryName]) {
      categoryRefs.current[categoryName].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword || !confirmNewPassword) {
      alert('Please fill in both password fields');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    setAdminPassword(newPassword);
    setNewPassword('');
    setConfirmNewPassword('');
    setChangingPassword(false);
    alert('Password changed successfully!');
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const submitOrder = async () => {
    if (cart.length === 0 || !customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newOrder = {
      id: Date.now(),
      items: [...cart],
      customerInfo: {...customerInfo},
      subtotal: cartTotal,
      tax: tax,
      total: total,
      status: 'pending',
      paymentMethod: 'Pay in Store',
      timestamp: new Date().toLocaleString(),
      prepTime: null,
      confirmedAt: null
    };
    
    // Save to Firebase
    try {
      await firebaseDB.saveOrder(newOrder);
      setOrders([newOrder, ...orders]);
      setCustomerOrderId(newOrder.id);
      setWaitingForConfirmation(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
      return;
    }
    
    setCart([]);
    setCustomerInfo({ name: '', phone: '', email: '', orderType: 'pickup', notes: '' });
  };

  // 添加新分类
  const addCategory = () => {
    if (newCategoryName.trim() && !menuCategories.some(c => c.name === newCategoryName.trim())) {
      const newCat = {
        id: Date.now(),
        name: newCategoryName.trim(),
        description: '',
        order: menuCategories.length + 1
      };
      setMenuCategories([...menuCategories, newCat]);
      setNewCategoryName('');
      setShowAddCategory(false);
      alert('Category added successfully!');
    } else {
      alert('Category already exists or invalid name');
    }
  };

  // 更新分类
  const updateCategory = () => {
    if (!editingCategory.name.trim()) {
      alert('Category name cannot be empty');
      return;
    }
    setMenuCategories(menuCategories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
    alert('Category updated successfully!');
  };

  // 删除分类
  const deleteCategory = (category) => {
    const hasItems = menuItems.some(item => item.category === category.name);
    if (hasItems) {
      alert('Cannot delete category with existing items. Please reassign or delete items first.');
      return;
    }
    if (confirm(`Delete category "${category.name}"?`)) {
      setMenuCategories(menuCategories.filter(c => c.id !== category.id));
    }
  };

  // 分类排序
  const moveCategoryUp = (index) => {
    if (index === 0) return;
    const newCategories = [...menuCategories];
    [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
    newCategories.forEach((cat, idx) => cat.order = idx + 1);
    setMenuCategories(newCategories);
  };

  const moveCategoryDown = (index) => {
    if (index === menuCategories.length - 1) return;
    const newCategories = [...menuCategories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    newCategories.forEach((cat, idx) => cat.order = idx + 1);
    setMenuCategories(newCategories);
  };

  // 添加菜品
  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.description) {
      alert('Please fill in all required fields');
      return;
    }

    // 验证套餐配置
    if (newItem.type === 'combo') {
      if (newItem.comboConfig.availableItems.length === 0) {
        alert('Please select at least one item for combo selection');
        return;
      }
      if (newItem.comboConfig.requiredSelections > newItem.comboConfig.availableItems.length) {
        alert(`Required selections (${newItem.comboConfig.requiredSelections}) cannot be more than available items (${newItem.comboConfig.availableItems.length})`);
        return;
      }
    }
    
    const item = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      price: parseFloat(newItem.price),
      description: newItem.description,
      image: newItem.image,
      available: true,
      tags: [],
      type: newItem.type,
      ...(newItem.type === 'combo' ? { comboConfig: { ...newItem.comboConfig } } : {})
    };
    
    // Save to Firebase
    try {
      await firebaseDB.saveMenuItem(item);
      setMenuItems([...menuItems, item]);
      setShowAddItem(false);
      alert('Menu item added successfully!');
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert(`Failed to add menu item: ${error.message}\n\nPlease check:\n1. Firebase is properly configured\n2. Firestore rules allow writes\n3. Check browser console for details`);
      return;
    }
    
    setNewItem({
      name: '',
      category: menuCategories[0]?.name || 'Appetizers',
      price: '',
      description: '',
      image: '🍱',
      available: true,
      type: 'regular',
      comboConfig: {
        requiredSelections: 3,
        availableItems: [],
        soupOptions: [],
        saladOptions: [],
        mainItemsLabel: 'Available Items for Selection',
        soupLabel: 'Soup Options',
        saladLabel: 'Salad Options'
      }
    });
    setShowAddItem(false);
    alert('Menu item added successfully!');
  };

  const updateMenuItem = async () => {
    if (!editingItem.name || !editingItem.price || !editingItem.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      await firebaseDB.updateMenuItem(editingItem);
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      alert('Menu item updated successfully!');
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Failed to update menu item. Please try again.');
    }
  };

  const deleteMenuItem = async (id) => {
    if (confirm('Delete this menu item?')) {
      try {
        await firebaseDB.deleteMenuItem(id);
        setMenuItems(menuItems.filter(item => item.id !== id));
        alert('Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item. Please try again.');
      }
    }
  };

  const confirmOrder = async () => {
    if (!prepTime || parseInt(prepTime) < 1) {
      alert('Please enter a valid preparation time');
      return;
    }
    
    const updatedOrder = {
      ...confirmingOrder,
      status: 'confirmed',
      prepTime: parseInt(prepTime),
      confirmedAt: new Date().toLocaleString()
    };
    
    try {
      await firebaseDB.updateOrder(updatedOrder);
      setOrders(orders.map(order => 
        order.id === confirmingOrder.id ? updatedOrder : order
      ));
      setConfirmingOrder(null);
      setPrepTime('');
      alert(`Order #${confirmingOrder.id} confirmed!\nPreparation time: ${prepTime} minutes`);
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Failed to confirm order. Please try again.');
    }
  };

  const completeOrder = async (orderId) => {
    if (confirm('Mark this order as completed?')) {
      try {
        const order = orders.find(o => o.id === orderId);
        const updatedOrder = { ...order, status: 'completed' };
        await firebaseDB.updateOrder(updatedOrder);
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
      } catch (error) {
        console.error('Error completing order:', error);
        alert('Failed to complete order. Please try again.');
      }
    }
  };

  // 更新餐厅信息
  const updateRestaurantInfo = () => {
    setEditingRestaurantInfo(false);
    alert('Restaurant information updated successfully!');
  };

  // 订单等待确认页面
  if (waitingForConfirmation || confirmedOrderDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
          {waitingForConfirmation && !confirmedOrderDetails ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
              <h2 className="text-3xl font-bold mb-4">Order Submitted Successfully! ✅</h2>
              <p className="text-xl text-gray-600 mb-6">
                Waiting for restaurant confirmation...
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <p className="text-lg font-semibold text-blue-800">Order #{customerOrderId}</p>
                <p className="text-blue-700 mt-2">The restaurant is reviewing your order and will confirm the pickup time shortly.</p>
              </div>
            </div>
          ) : confirmedOrderDetails ? (
            <div>
              <div className="text-center mb-6">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={48} />
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600">Your order has been confirmed by the restaurant</p>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-center mb-2">Pickup Time</h3>
                <p className="text-4xl font-bold text-orange-600 text-center">
                  {confirmedOrderDetails.prepTime} Minutes
                </p>
                <p className="text-center text-gray-600 mt-2">Please arrive at:</p>
                <p className="text-center font-semibold">{restaurantInfo.address}</p>
              </div>

              <div className="border-2 border-gray-300 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-center border-b-2 pb-2">Order Receipt</h3>
                
                <div className="mb-4">
                  <p className="font-semibold">Order #: {confirmedOrderDetails.id}</p>
                  <p className="text-sm text-gray-600">Confirmed at: {confirmedOrderDetails.confirmedAt}</p>
                </div>

                <div className="mb-4">
                  <p className="font-semibold">Customer:</p>
                  <p>{confirmedOrderDetails.customerInfo.name}</p>
                  <p>{confirmedOrderDetails.customerInfo.phone}</p>
                  <p>{confirmedOrderDetails.customerInfo.email}</p>
                </div>

                <div className="border-t-2 pt-4 mb-4">
                  <h4 className="font-bold mb-2">Items:</h4>
                  {confirmedOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between mb-2">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${confirmedOrderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${confirmedOrderDetails.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold border-t-2 pt-2">
                    <span>Total:</span>
                    <span className="text-orange-600">${confirmedOrderDetails.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="font-bold text-green-800">Payment: Pay in Store</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setConfirmedOrderDetails(null);
                  setCustomerOrderId(null);
                  setShowCheckout(false);
                  setView('customer');
                }}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700"
              >
                Close & Return to Menu
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // CHECKOUT PAGE
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">{restaurantInfo.name}</h1>
              <p className="text-orange-100 mt-1">{restaurantInfo.tagline}</p>
            </div>
            <button 
              onClick={() => setShowCheckout(false)}
              className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 flex items-center space-x-2"
            >
              <X size={20} />
              <span>Back to Menu</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <button onClick={() => setShowCheckout(false)} className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Start Ordering
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Customer Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-bold mb-4">Additional Notes (Optional)</h3>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    placeholder="Special requests or delivery instructions..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-8 sticky top-6">
                  <h2 className="text-2xl font-bold mb-6 pb-4 border-b-2">Your Order</h2>

                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.cartId} className="flex items-start justify-between py-4 border-b">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-lg font-bold text-orange-600">{item.quantity}x</span>
                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                          </div>
                          <p className="text-gray-600 ml-8">${item.price.toFixed(2)} each</p>
                          {item.specialNotes && (
                            <p className="text-sm text-gray-500 italic ml-8 mt-1">Note: {item.specialNotes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 py-6 border-t-2">
                    <div className="flex justify-between text-lg text-gray-600">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg text-gray-600">
                      <span>Tax (8.375%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-3xl font-bold text-gray-900 pt-4 border-t-2">
                      <span>Total:</span>
                      <span className="text-orange-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                    <p className="font-bold text-green-800 text-lg">💳 Payment: Pay in Store</p>
                    <p className="text-green-700 mt-1">You will pay when you pick up your order</p>
                  </div>

                  <button
                    onClick={submitOrder}
                    disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.email}
                    className="w-full py-5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-2xl transition shadow-lg"
                  >
                    {(!customerInfo.name || !customerInfo.phone || !customerInfo.email)
                      ? 'Please Complete Form Above'
                      : `Place Order - ${total.toFixed(2)}`
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setView('admin-login')}
          className="fixed bottom-6 left-6 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700"
        >
          <Settings size={24} />
        </button>
      </div>
    );
  }

  // ADMIN LOGIN
  if (view === 'admin-login') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Lock className="text-orange-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && loginPassword === adminPassword) {
                setIsAdminAuthenticated(true);
                setView('admin');
                setLoginPassword('');
              }
            }}
            className="w-full px-4 py-3 border rounded-lg mb-4"
          />
          <button
            onClick={() => {
              if (loginPassword === adminPassword) {
                setIsAdminAuthenticated(true);
                setView('admin');
                setLoginPassword('');
              } else {
                alert('Incorrect password');
              }
            }}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700"
          >
            Login
          </button>
          <button
            onClick={() => setView('customer')}
            className="w-full mt-3 text-gray-600 hover:text-gray-800"
          >
            Back to Website
          </button>
          <p className="text-sm text-gray-500 mt-4 text-center">Password: admin123</p>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD  
  if (view === 'admin' && isAdminAuthenticated) {
    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
    const confirmedOrdersCount = orders.filter(o => o.status === 'confirmed').length;
    
    // 按分类分组菜品
    const itemsByCategory = {};
    menuCategories.forEach(cat => {
      itemsByCategory[cat.name] = menuItems.filter(item => item.category === cat.name);
    });
    
    return (
      <div className="min-h-screen bg-gray-50">
        {hasUnconfirmedOrders && (
          <div className="bg-red-600 text-white py-4 px-6 animate-pulse">
            <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
              <Bell size={32} className="animate-bounce" />
              <p className="text-2xl font-bold">⚠️ NEW ORDER ALERT! {pendingOrdersCount} PENDING ORDER(S) - PLEASE CONFIRM ⚠️</p>
              <Bell size={32} className="animate-bounce" />
            </div>
          </div>
        )}
        
        <nav className="bg-gray-900 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Admin - {restaurantInfo.name}</h1>
              {pendingOrdersCount > 0 && (
                <span className="px-3 py-1 bg-red-600 rounded-full text-sm font-bold animate-pulse">
                  {pendingOrdersCount} New!
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setView('customer')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Home size={18} />
                <span>View Website</span>
              </button>
              <button
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  setView('customer');
                  stopNotificationSound();
                }}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setAdminTab('orders')}
                className={`py-4 px-6 font-semibold border-b-4 transition ${
                  adminTab === 'orders'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Orders {pendingOrdersCount > 0 && `(${pendingOrdersCount})`}
              </button>
              <button
                onClick={() => setAdminTab('menu')}
                className={`py-4 px-6 font-semibold border-b-4 transition ${
                  adminTab === 'menu'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setAdminTab('categories')}
                className={`py-4 px-6 font-semibold border-b-4 transition ${
                  adminTab === 'categories'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setAdminTab('settings')}
                className={`py-4 px-6 font-semibold border-b-4 transition ${
                  adminTab === 'settings'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setAdminTab('seo')}
                className={`py-4 px-6 font-semibold border-b-4 transition ${
                  adminTab === 'seo'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                SEO
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* ORDERS TAB */}
          {adminTab === 'orders' && (
            <div>
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                  <p className="text-4xl font-bold text-red-600">{pendingOrdersCount}</p>
                  <p className="text-gray-600">Pending Orders</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <p className="text-4xl font-bold text-blue-600">{confirmedOrdersCount}</p>
                  <p className="text-gray-600">In Progress</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <p className="text-4xl font-bold text-green-600">{orders.filter(o => o.status === 'completed').length}</p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-xl text-gray-600">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className={`bg-white rounded-lg shadow-lg p-6 border-l-8 ${
                        order.status === 'pending'
                          ? 'border-red-500 animate-pulse'
                          : order.status === 'confirmed'
                          ? 'border-blue-500'
                          : 'border-green-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">Order #{order.id}</h3>
                          <p className="text-gray-600">{order.timestamp}</p>
                          <div className="mt-2">
                            <span
                              className={`px-4 py-2 rounded-full font-bold text-sm ${
                                order.status === 'pending'
                                  ? 'bg-red-100 text-red-700'
                                  : order.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-orange-600">${order.total.toFixed(2)}</p>
                          <p className="text-gray-600">{order.customerInfo.orderType}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-bold mb-2">Customer Information:</h4>
                        <p><strong>Name:</strong> {order.customerInfo.name}</p>
                        <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                        <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        <p><strong>Type:</strong> {order.customerInfo.orderType}</p>
                        {order.customerInfo.notes && (
                          <p><strong>Notes:</strong> {order.customerInfo.notes}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold mb-2">Order Items:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                              <div>
                                <span className="font-bold text-orange-600">{item.quantity}x</span>{' '}
                                <span className="font-semibold">{item.name}</span>
                                {item.specialNotes && (
                                  <p className="text-sm text-gray-600 italic ml-6">Note: {item.specialNotes}</p>
                                )}
                              </div>
                              <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.prepTime && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="font-bold text-blue-800">
                            ⏱️ Preparation Time: {order.prepTime} minutes
                          </p>
                          {order.confirmedAt && (
                            <p className="text-sm text-blue-700">Confirmed at: {order.confirmedAt}</p>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-3">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => setConfirmingOrder(order)}
                            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center space-x-2"
                          >
                            <Check size={20} />
                            <span>CONFIRM ORDER</span>
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => completeOrder(order.id)}
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700"
                          >
                            Mark as Completed
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <div className="flex-1 bg-green-50 border-2 border-green-500 py-3 px-6 rounded-lg font-bold text-green-700 text-center">
                            ✅ Completed
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MENU MANAGEMENT TAB */}
          {adminTab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Menu Items by Category</h2>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add New Item</span>
                </button>
              </div>

              {menuCategories.map(category => {
                const items = itemsByCategory[category.name] || [];
                return (
                  <div key={category.id} className="mb-8">
                    <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-4 mb-4">
                      <h3 className="text-2xl font-bold text-orange-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-orange-700 mt-1">{category.description}</p>
                      )}
                      <p className="text-sm text-orange-600 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                    </div>
                    
                    {items.length === 0 ? (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                        No items in this category yet
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {items.map(item => (
                          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-3xl">{item.image}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                                  <span className={`text-sm px-2 py-1 rounded ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.available ? 'Available' : 'Unavailable'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingItem({...item})}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                              >
                                <Edit size={16} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => deleteMenuItem(item.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                              >
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CATEGORIES TAB */}
          {adminTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Menu Categories</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800"><strong>💡 Tip:</strong> Use the arrows to reorder categories. The order here determines the display order on the customer menu.</p>
              </div>

              <div className="space-y-3">
                {menuCategories.map((category, index) => {
                  const itemCount = menuItems.filter(item => item.category === category.name).length;
                  return (
                    <div key={category.id} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => moveCategoryUp(index)}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ArrowUp size={20} />
                          </button>
                          <button
                            onClick={() => moveCategoryDown(index)}
                            disabled={index === menuCategories.length - 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ArrowDown size={20} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''} • Order: {index + 1}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCategory({...category})}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteCategory(category)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {adminTab === 'settings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Restaurant Settings</h2>
                {!editingRestaurantInfo && (
                  <button
                    onClick={() => setEditingRestaurantInfo(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Edit size={20} />
                    <span>Edit Information</span>
                  </button>
                )}
              </div>

              {editingRestaurantInfo ? (
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                  <div>
                    <label className="block font-semibold mb-2">Restaurant Name</label>
                    <input
                      type="text"
                      value={restaurantInfo.name}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Tagline</label>
                    <input
                      type="text"
                      value={restaurantInfo.tagline}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, tagline: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={restaurantInfo.phone}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Address</label>
                    <input
                      type="text"
                      value={restaurantInfo.address}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={restaurantInfo.email}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-4">Business Hours</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(restaurantInfo.hours).map(day => (
                        <div key={day}>
                          <label className="block font-semibold mb-2 capitalize">{day}</label>
                          <input
                            type="text"
                            value={restaurantInfo.hours[day]}
                            onChange={(e) => setRestaurantInfo({
                              ...restaurantInfo,
                              hours: {...restaurantInfo.hours, [day]: e.target.value}
                            })}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="11:00 AM - 9:00 PM"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditingRestaurantInfo(false)}
                      className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateRestaurantInfo}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Restaurant Name:</span>
                        <span>{restaurantInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Tagline:</span>
                        <span>{restaurantInfo.tagline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Phone:</span>
                        <span>{restaurantInfo.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Address:</span>
                        <span>{restaurantInfo.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Email:</span>
                        <span>{restaurantInfo.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4">Business Hours</h3>
                    <div className="space-y-2">
                      {Object.entries(restaurantInfo.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-semibold capitalize">{day}:</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4">Admin Password</h3>
                    {!changingPassword ? (
                      <button
                        onClick={() => setChangingPassword(true)}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                      >
                        Change Password
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block font-medium mb-2">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Enter new password (min 6 characters)"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handlePasswordChange}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                          >
                            Save Password
                          </button>
                          <button
                            onClick={() => {
                              setChangingPassword(false);
                              setNewPassword('');
                              setConfirmNewPassword('');
                            }}
                            className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEO TAB */}
          {adminTab === 'seo' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">SEO Optimization</h2>
                <p className="text-gray-600">Optimize your website for search engines to improve visibility and rankings.</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                  <label className="block font-semibold mb-2 flex items-center space-x-2">
                    <Globe size={18} />
                    <span>Meta Title</span>
                  </label>
                  <input
                    type="text"
                    value={seoSettings.metaTitle}
                    onChange={(e) => setSeoSettings({...seoSettings, metaTitle: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="AJI SUSHI - Best Japanese Restaurant"
                  />
                  <p className="text-sm text-gray-500 mt-1">Recommended: 50-60 characters. Current: {seoSettings.metaTitle.length}</p>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Meta Description</label>
                  <textarea
                    value={seoSettings.metaDescription}
                    onChange={(e) => setSeoSettings({...seoSettings, metaDescription: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Order fresh sushi and authentic Japanese cuisine online..."
                  />
                  <p className="text-sm text-gray-500 mt-1">Recommended: 150-160 characters. Current: {seoSettings.metaDescription.length}</p>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={seoSettings.metaKeywords}
                    onChange={(e) => setSeoSettings({...seoSettings, metaKeywords: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="sushi, japanese food, restaurant, delivery"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Open Graph (Social Media)</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-2">OG Title</label>
                      <input
                        type="text"
                        value={seoSettings.ogTitle}
                        onChange={(e) => setSeoSettings({...seoSettings, ogTitle: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="AJI SUSHI - Order Online"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">OG Description</label>
                      <textarea
                        value={seoSettings.ogDescription}
                        onChange={(e) => setSeoSettings({...seoSettings, ogDescription: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={3}
                        placeholder="Fresh and authentic Japanese cuisine..."
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">OG Image URL</label>
                      <input
                        type="text"
                        value={seoSettings.ogImage}
                        onChange={(e) => setSeoSettings({...seoSettings, ogImage: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x630px</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">✅ SEO Tips:</h4>
                  <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                    <li>Use relevant keywords naturally in your title and description</li>
                    <li>Keep meta titles under 60 characters</li>
                    <li>Keep meta descriptions between 150-160 characters</li>
                    <li>Include your location for local SEO</li>
                    <li>Update content regularly to stay relevant</li>
                  </ul>
                </div>

                <button
                  onClick={() => alert('SEO settings saved successfully!')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                >
                  Save SEO Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ORDER CONFIRMATION MODAL */}
        {confirmingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-8">
              <div className="text-center mb-6">
                <AlertCircle className="text-orange-600 mx-auto mb-4" size={64} />
                <h2 className="text-2xl font-bold">Confirm Order #{confirmingOrder.id}</h2>
                <p className="text-gray-600 mt-2">Enter preparation time to confirm this order</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p><strong>Customer:</strong> {confirmingOrder.customerInfo.name}</p>
                <p><strong>Total:</strong> ${confirmingOrder.total.toFixed(2)}</p>
                <p><strong>Items:</strong> {confirmingOrder.items.length}</p>
              </div>

              <div className="mb-6">
                <label className="block font-bold mb-2 text-lg">Preparation Time (minutes) *</label>
                <input
                  type="number"
                  min="1"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="e.g., 20"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-xl font-bold text-center focus:border-orange-500 outline-none"
                  autoFocus
                />
                <p className="text-sm text-gray-500 mt-2 text-center">How many minutes until this order is ready?</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setConfirmingOrder(null);
                    setPrepTime('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmOrder}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Check size={20} />
                  <span>Confirm Order</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD CATEGORY MODAL */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Lunch Specials"
                    className="w-full px-4 py-3 border rounded-lg"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={addCategory}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT CATEGORY MODAL */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Description (Optional)</label>
                  <textarea
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                    placeholder="e.g., Start your meal with our delicious appetizers"
                    className="w-full px-4 py-3 border rounded-lg"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">This description will appear under the category name on the menu</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={updateCategory}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Update Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD ITEM MODAL */}
        {showAddItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
              <div className="sticky top-0 bg-white z-10 p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Add New Menu Item</h2>
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({
                        name: '',
                        category: menuCategories[0]?.name || 'Appetizers',
                        price: '',
                        description: '',
                        image: '🍱',
                        available: true,
                        type: 'regular',
                        comboConfig: {
                          requiredSelections: 3,
                          availableItems: [],
                          soupOptions: [],
                          saladOptions: [],
                          mainItemsLabel: 'Available Items for Selection',
                          soupLabel: 'Soup Options',
                          saladLabel: 'Salad Options'
                        }
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Item Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="regular">Regular Item</option>
                    <option value="combo">Combo/Set Meal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g., Dragon Roll"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Category *</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {menuCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    placeholder="e.g., 12.95"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Description *</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="e.g., Eel, avocado, topped with spicy mayo"
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Emoji Icon</label>
                  <input
                    type="text"
                    value={newItem.image}
                    onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                    placeholder="🍱"
                    className="w-full px-4 py-2 border rounded-lg text-2xl"
                  />
                </div>

                {newItem.type === 'combo' && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="font-bold text-lg text-purple-700">Combo Configuration</h3>
                    
                    <div>
                      <label className="block font-semibold mb-2">Number of Items Customer Must Choose *</label>
                      <input
                        type="number"
                        min="1"
                        value={newItem.comboConfig.requiredSelections}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          comboConfig: { ...newItem.comboConfig, requiredSelections: parseInt(e.target.value) || 3 }
                        })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="e.g., 3"
                      />
                      <p className="text-sm text-gray-600 mt-1">Customer will choose this many items from the list below</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-semibold">Main Items Section Title *</label>
                      </div>
                      <input
                        type="text"
                        value={newItem.comboConfig.mainItemsLabel}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          comboConfig: { ...newItem.comboConfig, mainItemsLabel: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg mb-3"
                        placeholder="e.g., Choose Your Rolls, Select Main Items"
                      />
                      <label className="block font-semibold mb-2">Items in This Section</label>
                      <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {menuItems.filter(item => item.type === 'regular' && item.available).length === 0 ? (
                          <p className="text-gray-500 text-sm">No regular items available. Please add some regular menu items first.</p>
                        ) : (
                          menuItems.filter(item => item.type === 'regular' && item.available).map(item => (
                            <label key={item.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <input
                                type="checkbox"
                                checked={newItem.comboConfig.availableItems.some(i => i.id === item.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewItem({
                                      ...newItem,
                                      comboConfig: {
                                        ...newItem.comboConfig,
                                        availableItems: [...newItem.comboConfig.availableItems, item]
                                      }
                                    });
                                  } else {
                                    setNewItem({
                                      ...newItem,
                                      comboConfig: {
                                        ...newItem.comboConfig,
                                        availableItems: newItem.comboConfig.availableItems.filter(i => i.id !== item.id)
                                      }
                                    });
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-xl">{item.image}</span>
                              <span className="flex-1">{item.name} - ${item.price.toFixed(2)}</span>
                            </label>
                          ))
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {newItem.comboConfig.availableItems.length} items
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-semibold">Soup Section Title (Optional)</label>
                      </div>
                      <input
                        type="text"
                        value={newItem.comboConfig.soupLabel}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          comboConfig: { ...newItem.comboConfig, soupLabel: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg mb-3"
                        placeholder="e.g., Add a Soup, Choose Your Soup"
                      />
                      <label className="block font-semibold mb-2">Items in This Section</label>
                      <div className="max-h-32 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {menuItems.filter(item => item.type === 'regular' && item.available).map(item => (
                          <label key={item.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={newItem.comboConfig.soupOptions.some(i => i.id === item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewItem({
                                    ...newItem,
                                    comboConfig: {
                                      ...newItem.comboConfig,
                                      soupOptions: [...newItem.comboConfig.soupOptions, item]
                                    }
                                  });
                                } else {
                                  setNewItem({
                                    ...newItem,
                                    comboConfig: {
                                      ...newItem.comboConfig,
                                      soupOptions: newItem.comboConfig.soupOptions.filter(i => i.id !== item.id)
                                    }
                                  });
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-xl">{item.image}</span>
                            <span className="flex-1">{item.name}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Customer can optionally add a soup</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-semibold">Salad Section Title (Optional)</label>
                      </div>
                      <input
                        type="text"
                        value={newItem.comboConfig.saladLabel}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          comboConfig: { ...newItem.comboConfig, saladLabel: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg mb-3"
                        placeholder="e.g., Add a Salad, Choose Your Salad"
                      />
                      <label className="block font-semibold mb-2">Items in This Section</label>
                      <div className="max-h-32 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {menuItems.filter(item => item.type === 'regular' && item.available).map(item => (
                          <label key={item.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={newItem.comboConfig.saladOptions.some(i => i.id === item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewItem({
                                    ...newItem,
                                    comboConfig: {
                                      ...newItem.comboConfig,
                                      saladOptions: [...newItem.comboConfig.saladOptions, item]
                                    }
                                  });
                                } else {
                                  setNewItem({
                                    ...newItem,
                                    comboConfig: {
                                      ...newItem.comboConfig,
                                      saladOptions: newItem.comboConfig.saladOptions.filter(i => i.id !== item.id)
                                    }
                                  });
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-xl">{item.image}</span>
                            <span className="flex-1">{item.name}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Customer can optionally add a salad</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="sticky bottom-0 bg-white p-6 border-t mt-6">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({
                        name: '',
                        category: menuCategories[0]?.name || 'Appetizers',
                        price: '',
                        description: '',
                        image: '🍱',
                        available: true,
                        type: 'regular',
                        comboConfig: {
                          requiredSelections: 3,
                          availableItems: [],
                          soupOptions: [],
                          saladOptions: [],
                          mainItemsLabel: 'Available Items for Selection',
                          soupLabel: 'Soup Options',
                          saladLabel: 'Salad Options'
                        }
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addMenuItem}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT ITEM MODAL */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
              <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Category *</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {menuCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Description *</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Emoji Icon</label>
                  <input
                    type="text"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg text-2xl"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingItem.available}
                      onChange={(e) => setEditingItem({...editingItem, available: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">Available for ordering</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={updateMenuItem}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Update Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CUSTOMER MENU PAGE
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-2">{restaurantInfo.name}</h1>
              <p className="text-orange-100 text-lg">{restaurantInfo.tagline}</p>
            </div>
            <div className="flex-1 flex justify-end">
              {cart.length > 0 && (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="relative bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 flex items-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Cart ({cart.length})</span>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white mt-4">
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <span>{restaurantInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>{restaurantInfo.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>Open: {restaurantInfo.hours.monday}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Menu Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => scrollToCategory('All')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedCategory === 'All' ? 'bg-orange-600 text-white font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  All Items
                </button>
                {menuCategories.map(cat => {
                  const count = menuItems.filter(i => i.category === cat.name && i.available).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.name)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition flex justify-between ${
                        selectedCategory === cat.name ? 'bg-orange-600 text-white font-semibold' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {selectedCategory === 'All' ? (
              menuCategories.map(category => {
                const items = filteredItems.filter(i => i.category === category.name);
                if (items.length === 0) return null;
                
                return (
                  <div 
                    key={category.id} 
                    className="mb-8" 
                    ref={el => categoryRefs.current[category.name] = el}
                  >
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold border-b-2 border-orange-600 pb-2">{category.name}</h2>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-2 italic">{category.description}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-3xl">{item.image}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
                          <button
                            onClick={() => openItemModal(item)}
                            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
            ) : (
              <div ref={el => categoryRefs.current[selectedCategory] = el}>
                {menuCategories.filter(cat => cat.name === selectedCategory).map(category => {
                  const items = filteredItems.filter(i => i.category === category.name);
                  
                  return (
                    <div key={category.id} className="mb-8">
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold border-b-2 border-orange-600 pb-2">{category.name}</h2>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-2 italic">{category.description}</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center relative">
                                <span className="text-3xl">{item.image}</span>
                                {item.type === 'combo' && (
                                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                    COMBO
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                                {item.type === 'combo' && (
                                  <p className="text-xs text-purple-600 mt-1">
                                    Choose {item.comboConfig.requiredSelections} items
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 ml-4">
                              <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
                              <button
                                onClick={() => openItemModal(item)}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium whitespace-nowrap"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                <p className="text-orange-600 text-xl font-bold">${selectedItem.price.toFixed(2)}</p>
              </div>
              <button onClick={() => setSelectedItem(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-8xl">{selectedItem.image}</span>
            </div>
            
            <p className="text-gray-600 mb-6">{selectedItem.description}</p>
            
            {selectedItem.type === 'combo' && (
              <div className="mb-6 border-t pt-6">
                <h3 className="font-bold text-lg mb-4">
                  Select {selectedItem.comboConfig.requiredSelections} items 
                  <span className="text-sm text-gray-600 ml-2">
                    ({comboSelections.selectedItems.length}/{selectedItem.comboConfig.requiredSelections} selected)
                  </span>
                </h3>
                
                <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                  {selectedItem.comboConfig.availableItems.map(item => {
                    const isSelected = comboSelections.selectedItems.some(i => i.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleComboItemToggle(item)}
                        className={`w-full p-3 rounded-lg border-2 transition flex items-center justify-between ${
                          isSelected 
                            ? 'border-orange-600 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.image}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {isSelected && (
                          <Check className="text-orange-600" size={24} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedItem.comboConfig.soupOptions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold mb-3">Choose Your Soup (Optional)</h4>
                    <div className="space-y-2">
                      {selectedItem.comboConfig.soupOptions.map(soup => (
                        <button
                          key={soup.id}
                          onClick={() => setComboSelections({
                            ...comboSelections,
                            selectedSoup: comboSelections.selectedSoup?.id === soup.id ? null : soup
                          })}
                          className={`w-full p-3 rounded-lg border-2 transition flex items-center justify-between ${
                            comboSelections.selectedSoup?.id === soup.id
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{soup.image}</span>
                            <span className="font-medium">{soup.name}</span>
                          </div>
                          {comboSelections.selectedSoup?.id === soup.id && (
                            <Check className="text-blue-600" size={24} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.comboConfig.saladOptions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold mb-3">Choose Your Salad (Optional)</h4>
                    <div className="space-y-2">
                      {selectedItem.comboConfig.saladOptions.map(salad => (
                        <button
                          key={salad.id}
                          onClick={() => setComboSelections({
                            ...comboSelections,
                            selectedSalad: comboSelections.selectedSalad?.id === salad.id ? null : salad
                          })}
                          className={`w-full p-3 rounded-lg border-2 transition flex items-center justify-between ${
                            comboSelections.selectedSalad?.id === salad.id
                              ? 'border-green-600 bg-green-50' 
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{salad.image}</span>
                            <span className="font-medium">{salad.name}</span>
                          </div>
                          {comboSelections.selectedSalad?.id === salad.id && (
                            <Check className="text-green-600" size={24} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block font-medium mb-2">Quantity</label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-bold w-12 text-center">{itemQuantity}</span>
                <button
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  className="w-10 h-10 rounded-full bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block font-medium mb-2">Special Instructions (Optional)</label>
              <textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="e.g., No onions, extra sauce..."
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            
            <button
              onClick={addToCart}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700"
            >
              Add to Cart - ${(selectedItem.price * itemQuantity).toFixed(2)}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setView('admin-login')}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
      >
        <Settings size={20} />
      </button>
    </div>
  );
};

export default AjiSushiOrdering;
