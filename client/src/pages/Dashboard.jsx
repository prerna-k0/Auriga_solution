import { useEffect, useState } from "react";
import axios from "axios";

const API = "/api";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API}/customers`, {
        params: {
          q: search,
          page,
          limit: 5,
          sort: "name",
          order: "asc"
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCustomers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, page]);

  return (
    <div className="min-h-screen bg-[#f5eee5] text-[#2d211b]">

      <header className="px-8 py-6 bg-[#2d211b] text-white">
        <h1 className="text-2xl font-bold">TiffinFlow</h1>
      </header>

      <main className="p-8 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold">
          Kitchen Dashboard
        </h2>

        {/* Search */}
        <input
          className="mt-6 w-full md:w-96 p-3 rounded-lg border bg-white"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Customers */}
        <div className="bg-white rounded-2xl mt-6 overflow-hidden">

          <div className="p-5 border-b">
            <h3 className="text-xl font-bold">
              Customers
            </h3>
          </div>

          {customers.map((customer) => (
            <div
              key={customer._id}
              className="flex justify-between items-center p-5 border-b"
            >
              <div>
                <p className="font-semibold">
                  {customer.name}
                </p>
                <p className="text-gray-500">
                  {customer.phone}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                Customer
              </span>
            </div>
          ))}

          {customers.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              No customers found.
            </p>
          )}

        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-6">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white rounded-lg disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white rounded-lg disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;