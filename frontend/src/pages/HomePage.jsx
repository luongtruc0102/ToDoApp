import {
  AddTask,
  DateTimeFilter,
  Footer,
  StatsAndFilters,
  TaskList,
  Header,
  TaskListPagination,
  ChangePassword,
} from "../components/Index.jsx";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.jsx";
import { LogOut } from "lucide-react";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTackCount, setActiveTackCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("all");
  const [page, setPage] = useState(1);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchTasks();
    } else {
      navigate("/login");
    }
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  //logic
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/tasks?filter=${dateQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Cập nhật trạng thái với dữ liệu mới
      setTaskBuffer(res.data.tasks);
      setActiveTackCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("❌ Lỗi khi truy xuất tasks:", error);
      toast.error("Không thể tải danh sách nhiệm vụ.");
    }
  };

  const handleTaskChanged = () => {
    // Đặt lại filter về "all" để hiển thị task mới
    setFilter("all");
    setDateQuery("all");
    fetchTasks();
    // fetchTasks sẽ được gọi tự động khi dateQuery thay đổi
  };

  const handleNext = () => {
    if (page >= 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  //biến
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  const visibleTacks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / visibleTaskLimit)
  );

  // Fix potential infinite loop by using useEffect instead of direct call
  useEffect(() => {
    if (visibleTacks.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [visibleTacks.length, page]);

  // hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full relative">
      <div className="absolute flex gap-2 top-3 right-5 z-20">
        <Button
          variant="gradient"
          size="sm"
          onClick={() => setShowChangePassword(true)}
          className="mt-2 px-6 cursor-pointer"
        >
          Đổi mật khẩu
        </Button>
        {showChangePassword && (
          <ChangePassword onClose={() => setShowChangePassword(false)} />
        )}

        <Button
          variant="gradient"
          size="sm"
          onClick={handleLogout}
          className="mt-2 px-6 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </Button>
      </div>

      <div className="container mx-auto pt-4   relative z-10 sm:flex-row items-center">
        <div className="w-full max-w-2xl p-4 mx-auto space-y-6">
          {/* Đầu trang */}
          <Header />

          {/* Tạo nhiệm vụ */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />

          {/* Thống kê và lọc */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activedTasksCount={activeTackCount}
            completedTasksCount={completeTaskCount}
          />

          {/* Danh sách nhiệm vụ */}
          <TaskList
            filteredTasks={visibleTacks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          {/* Phân trang và lọc theo ngày */}
          <div className="flex flex-col justify-between items-center gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>

          {/* Chân trang */}
          <Footer
            activedTasksCount={activeTackCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
