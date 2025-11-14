"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  CheckSquare,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
} from "lucide-react";

// Types
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "client" | "supplier";
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  price: number;
  category: string;
}

interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  products: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

export default function BusinessControl() {
  const [activeTab, setActiveTab] = useState<"clients" | "stock" | "sales" | "tasks">("clients");
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Modal states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Load data from localStorage
  useEffect(() => {
    const loadedClients = localStorage.getItem("business_clients");
    const loadedProducts = localStorage.getItem("business_products");
    const loadedSales = localStorage.getItem("business_sales");
    const loadedTasks = localStorage.getItem("business_tasks");

    if (loadedClients) setClients(JSON.parse(loadedClients));
    if (loadedProducts) setProducts(JSON.parse(loadedProducts));
    if (loadedSales) setSales(JSON.parse(loadedSales));
    if (loadedTasks) setTasks(JSON.parse(loadedTasks));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("business_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("business_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("business_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("business_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Client functions
  const addClient = (client: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setClients([...clients, newClient]);
    setShowClientModal(false);
    setEditingItem(null);
  };

  const updateClient = (id: string, updatedClient: Partial<Client>) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, ...updatedClient } : c)));
    setShowClientModal(false);
    setEditingItem(null);
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  // Product functions
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
    setShowProductModal(false);
    setEditingItem(null);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)));
    setShowProductModal(false);
    setEditingItem(null);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Sale functions
  const addSale = (sale: Omit<Sale, "id" | "date">) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setSales([...sales, newSale]);
    
    // Update stock
    sale.products.forEach((item) => {
      updateProduct(item.productId, {
        quantity: products.find((p) => p.id === item.productId)!.quantity - item.quantity,
      });
    });
    
    setShowSaleModal(false);
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter((s) => s.id !== id));
  };

  // Task functions
  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
    setEditingItem(null);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
    setShowTaskModal(false);
    setEditingItem(null);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Statistics
  const totalRevenue = sales
    .filter((s) => s.status === "completed")
    .reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = products.filter((p) => p.quantity <= p.minQuantity);
  const pendingTasks = tasks.filter((t) => t.status !== "completed");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-yellow-500 border-b border-yellow-500/20 shadow-lg shadow-yellow-500/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Controle Empresarial</h1>
          <p className="text-white/90 text-sm sm:text-base mt-1">
            Gerencie suas operações de forma eficiente
          </p>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl shadow-lg p-4 border border-green-400/30 hover:shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total Clientes</p>
                <p className="text-2xl font-bold text-white">{clients.length}</p>
              </div>
              <Users className="w-10 h-10 text-white/90" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-xl shadow-lg p-4 border border-yellow-300/30 hover:shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900/80">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-gray-900/90" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-500 rounded-xl shadow-lg p-4 border border-red-400/30 hover:shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Estoque Baixo</p>
                <p className="text-2xl font-bold text-white">{lowStockProducts.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-white/90" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl shadow-lg p-4 border border-green-400/30 hover:shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Tarefas Pendentes</p>
                <p className="text-2xl font-bold text-white">{pendingTasks.length}</p>
              </div>
              <CheckSquare className="w-10 h-10 text-white/90" />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-lg shadow-yellow-500/10 mb-6 overflow-x-auto border border-yellow-500/20">
          <div className="flex border-b border-yellow-500/20">
            <button
              onClick={() => setActiveTab("clients")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "clients"
                  ? "border-b-2 border-yellow-500 text-yellow-400 bg-yellow-500/10"
                  : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline">Clientes</span>
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "stock"
                  ? "border-b-2 border-yellow-500 text-yellow-400 bg-yellow-500/10"
                  : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5"
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="hidden sm:inline">Estoque</span>
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "sales"
                  ? "border-b-2 border-yellow-500 text-yellow-400 bg-yellow-500/10"
                  : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Vendas</span>
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition-all whitespace-nowrap ${
                activeTab === "tasks"
                  ? "border-b-2 border-yellow-500 text-yellow-400 bg-yellow-500/10"
                  : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5"
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Tarefas</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-lg shadow-yellow-500/10 p-4 sm:p-6 border border-yellow-500/20">
          {/* Clients Tab */}
          {activeTab === "clients" && (
            <ClientsTab
              clients={clients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              setShowClientModal={setShowClientModal}
              setEditingItem={setEditingItem}
              deleteClient={deleteClient}
            />
          )}

          {/* Stock Tab */}
          {activeTab === "stock" && (
            <StockTab
              products={products}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setShowProductModal={setShowProductModal}
              setEditingItem={setEditingItem}
              deleteProduct={deleteProduct}
            />
          )}

          {/* Sales Tab */}
          {activeTab === "sales" && (
            <SalesTab
              sales={sales}
              clients={clients}
              products={products}
              setShowSaleModal={setShowSaleModal}
              deleteSale={deleteSale}
            />
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <TasksTab
              tasks={tasks}
              setShowTaskModal={setShowTaskModal}
              setEditingItem={setEditingItem}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showClientModal && (
        <ClientModal
          editingItem={editingItem}
          onClose={() => {
            setShowClientModal(false);
            setEditingItem(null);
          }}
          onSave={(client) => {
            if (editingItem) {
              updateClient(editingItem.id, client);
            } else {
              addClient(client);
            }
          }}
        />
      )}

      {showProductModal && (
        <ProductModal
          editingItem={editingItem}
          onClose={() => {
            setShowProductModal(false);
            setEditingItem(null);
          }}
          onSave={(product) => {
            if (editingItem) {
              updateProduct(editingItem.id, product);
            } else {
              addProduct(product);
            }
          }}
        />
      )}

      {showSaleModal && (
        <SaleModal
          clients={clients}
          products={products}
          onClose={() => setShowSaleModal(false)}
          onSave={addSale}
        />
      )}

      {showTaskModal && (
        <TaskModal
          editingItem={editingItem}
          onClose={() => {
            setShowTaskModal(false);
            setEditingItem(null);
          }}
          onSave={(task) => {
            if (editingItem) {
              updateTask(editingItem.id, task);
            } else {
              addTask(task);
            }
          }}
        />
      )}
    </div>
  );
}

// Clients Tab Component
function ClientsTab({
  clients,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  setShowClientModal,
  setEditingItem,
  deleteClient,
}: any) {
  const filteredClients = clients.filter((client: Client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || client.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200 placeholder-gray-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
        >
          <option value="all">Todos</option>
          <option value="client">Clientes</option>
          <option value="supplier">Fornecedores</option>
        </select>
        <button
          onClick={() => setShowClientModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Adicionar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-yellow-500/20">
              <th className="text-left py-3 px-4 font-semibold text-yellow-400">Nome</th>
              <th className="text-left py-3 px-4 font-semibold text-yellow-400">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-yellow-400">Telefone</th>
              <th className="text-left py-3 px-4 font-semibold text-yellow-400">Tipo</th>
              <th className="text-right py-3 px-4 font-semibold text-yellow-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client: Client) => (
              <tr key={client.id} className="border-b border-yellow-500/10 hover:bg-yellow-500/5">
                <td className="py-3 px-4 text-gray-200">{client.name}</td>
                <td className="py-3 px-4 text-gray-400">{client.email}</td>
                <td className="py-3 px-4 text-gray-400">{client.phone}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      client.type === "client"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {client.type === "client" ? "Cliente" : "Fornecedor"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(client);
                        setShowClientModal(true);
                      }}
                      className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum cliente encontrado
          </div>
        )}
      </div>
    </div>
  );
}

// Stock Tab Component
function StockTab({
  products,
  searchTerm,
  setSearchTerm,
  setShowProductModal,
  setEditingItem,
  deleteProduct,
}: any) {
  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200 placeholder-gray-500"
          />
        </div>
        <button
          onClick={() => setShowProductModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product: Product) => (
          <div
            key={product.id}
            className={`border rounded-xl p-4 hover:shadow-lg transition-all ${
              product.quantity <= product.minQuantity
                ? "border-red-500/40 bg-red-500/5 shadow-red-500/20"
                : "border-yellow-500/30 bg-[#0a0a0a]/50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-200">{product.name}</h3>
                <p className="text-sm text-gray-400">{product.category}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingItem(product);
                    setShowProductModal(true);
                  }}
                  className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Quantidade:</span>
                <span
                  className={`font-semibold ${
                    product.quantity <= product.minQuantity
                      ? "text-red-400"
                      : "text-gray-200"
                  }`}
                >
                  {product.quantity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Mínimo:</span>
                <span className="text-gray-200">{product.minQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Preço:</span>
                <span className="font-semibold text-yellow-400">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
            </div>
            {product.quantity <= product.minQuantity && (
              <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Estoque baixo!</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum produto encontrado
        </div>
      )}
    </div>
  );
}

// Sales Tab Component
function SalesTab({ sales, clients, products, setShowSaleModal, deleteSale }: any) {
  const totalSales = sales.reduce((sum: number, sale: Sale) => sum + sale.total, 0);
  const completedSales = sales.filter((s: Sale) => s.status === "completed").length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/40">
          <p className="text-sm text-green-400 font-medium">Total de Vendas</p>
          <p className="text-2xl font-bold text-green-300">{sales.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/40">
          <p className="text-sm text-yellow-400 font-medium">Vendas Concluídas</p>
          <p className="text-2xl font-bold text-yellow-300">{completedSales}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-4 border border-red-500/40">
          <p className="text-sm text-red-400 font-medium">Receita Total</p>
          <p className="text-2xl font-bold text-red-300">R$ {totalSales.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowSaleModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Nova Venda
        </button>
      </div>

      <div className="space-y-4">
        {sales.map((sale: Sale) => (
          <div key={sale.id} className="border border-yellow-500/30 rounded-xl p-4 hover:shadow-md hover:shadow-yellow-500/20 transition-all bg-[#0a0a0a]/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
              <div>
                <h3 className="font-semibold text-gray-200">{sale.clientName}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(sale.date).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sale.status === "completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : sale.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {sale.status === "completed"
                    ? "Concluída"
                    : sale.status === "pending"
                    ? "Pendente"
                    : "Cancelada"}
                </span>
                <button
                  onClick={() => deleteSale(sale.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {sale.products.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {item.productName} x {item.quantity}
                  </span>
                  <span className="text-gray-200">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-yellow-500/20 flex justify-between items-center">
              <span className="font-semibold text-gray-300">Total:</span>
              <span className="text-xl font-bold text-yellow-400">
                R$ {sale.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {sales.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma venda registrada
        </div>
      )}
    </div>
  );
}

// Tasks Tab Component
function TasksTab({ tasks, setShowTaskModal, setEditingItem, updateTask, deleteTask }: any) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </button>
      </div>

      <div className="space-y-4">
        {sortedTasks.map((task: Task) => (
          <div
            key={task.id}
            className={`border rounded-xl p-4 hover:shadow-lg transition-all ${
              task.priority === "high"
                ? "border-red-500/40 bg-red-500/5 shadow-red-500/20"
                : task.priority === "medium"
                ? "border-yellow-500/40 bg-yellow-500/5 shadow-yellow-500/20"
                : "border-green-500/30 bg-green-500/5 shadow-green-500/10"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-200">{task.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : task.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}
                  >
                    {task.priority === "high"
                      ? "Alta"
                      : task.priority === "medium"
                      ? "Média"
                      : "Baixa"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Prazo: {new Date(task.deadline).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateTask(task.id, { status: e.target.value as Task["status"] })
                  }
                  className="px-3 py-1 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
                >
                  <option value="pending">Pendente</option>
                  <option value="in-progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
                <button
                  onClick={() => {
                    setEditingItem(task);
                    setShowTaskModal(true);
                  }}
                  className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma tarefa cadastrada
        </div>
      )}
    </div>
  );
}

// Client Modal
function ClientModal({ editingItem, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    email: editingItem?.email || "",
    phone: editingItem?.phone || "",
    type: editingItem?.type || "client",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/20 max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          {editingItem ? "Editar" : "Adicionar"} Cliente/Fornecedor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            >
              <option value="client">Cliente</option>
              <option value="supplier">Fornecedor</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-yellow-500/30 text-gray-300 rounded-lg hover:bg-[#0a0a0a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Product Modal
function ProductModal({ editingItem, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    quantity: editingItem?.quantity || 0,
    minQuantity: editingItem?.minQuantity || 0,
    price: editingItem?.price || 0,
    category: editingItem?.category || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/20 max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          {editingItem ? "Editar" : "Adicionar"} Produto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Quantidade</label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mínimo</label>
              <input
                type="number"
                required
                min="0"
                value={formData.minQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, minQuantity: Number(e.target.value) })
                }
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Preço (R$)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-yellow-500/30 text-gray-300 rounded-lg hover:bg-[#0a0a0a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sale Modal
function SaleModal({ clients, products, onClose, onSave }: any) {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: string; productName: string; quantity: number; price: number }[]
  >([]);
  const [status, setStatus] = useState<"completed" | "pending" | "cancelled">("completed");

  const addProduct = () => {
    if (products.length > 0) {
      const product = products[0];
      setSelectedProducts([
        ...selectedProducts,
        { productId: product.id, productName: product.name, quantity: 1, price: product.price },
      ]);
    }
  };

  const updateProductQuantity = (index: number, quantity: number) => {
    const updated = [...selectedProducts];
    updated[index].quantity = quantity;
    setSelectedProducts(updated);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const changeProduct = (index: number, productId: string) => {
    const product = products.find((p: Product) => p.id === productId);
    if (product) {
      const updated = [...selectedProducts];
      updated[index] = {
        productId: product.id,
        productName: product.name,
        quantity: updated[index].quantity,
        price: product.price,
      };
      setSelectedProducts(updated);
    }
  };

  const total = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || selectedProducts.length === 0) return;

    const client = clients.find((c: Client) => c.id === selectedClient);
    onSave({
      clientId: selectedClient,
      clientName: client.name,
      products: selectedProducts,
      total,
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/20 max-w-2xl w-full p-6 my-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Nova Venda</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cliente</label>
            <select
              required
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            >
              <option value="">Selecione um cliente</option>
              {clients
                .filter((c: Client) => c.type === "client")
                .map((client: Client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            >
              <option value="completed">Concluída</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">Produtos</label>
              <button
                type="button"
                onClick={addProduct}
                className="text-sm text-yellow-400 hover:text-yellow-300 font-medium"
              >
                + Adicionar Produto
              </button>
            </div>
            <div className="space-y-3">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={item.productId}
                    onChange={(e) => changeProduct(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
                  >
                    {products.map((product: Product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - R$ {product.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateProductQuantity(index, Number(e.target.value))}
                    className="w-20 px-3 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-300">Total:</span>
              <span className="text-2xl font-bold text-yellow-400">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-yellow-500/30 text-gray-300 rounded-lg hover:bg-[#0a0a0a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30"
            >
              Registrar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Task Modal
function TaskModal({ editingItem, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    title: editingItem?.title || "",
    description: editingItem?.description || "",
    deadline: editingItem?.deadline || "",
    status: editingItem?.status || "pending",
    priority: editingItem?.priority || "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/20 max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          {editingItem ? "Editar" : "Adicionar"} Tarefa
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Prazo</label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Prioridade</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-200"
            >
              <option value="pending">Pendente</option>
              <option value="in-progress">Em Andamento</option>
              <option value="completed">Concluída</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-yellow-500/30 text-gray-300 rounded-lg hover:bg-[#0a0a0a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/30"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
