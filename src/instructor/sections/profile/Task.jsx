import { Card, CardContent } from "@/components/ui/card";
import No_data_found from "@/instructor/common/no_data_found";
import { EmployeeTask } from "@/instructor/Redux/Api/EmployeeApi";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"; // Import Link
import logo from "../../../assets/logo/image.png";
const Task = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);
  const dispatch = useDispatch();
  const { Task, loading, error } = useSelector(
    (state) => state.EmployeeProfile
  );
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.error?.length > 0
        ? error.error[0]?.message
        : error?.message || "Something went wrong. Please try again.";
  const data = {
    total: Task.totalTasks || 0,
    text: "text-blue-600",
    stats: [
      {
        title: "Incompleted Task",
          titleColor: "text-blue-600",
        cards: [
          {
            label: "Task Not Completed",
            value: Task["not completed"] || 0,
            border: "border-blue-500",
            text: "text-blue-600",
            link: "/Dashboard",
          },
        ],
      },
      {
        title: "Not started Task",
         titleColor: "text-purple-600",
        cards: [
          {
            label: "Task Not Started",
            value: Task["not started"] || 0,
            border: "border-purple-500",
            text: "text-blue-600",
            link: "/Dashboard",
          },
        ],
      },
      {
        title: "Ongoing Task",
        titleColor: "text-yellow-600",
        cards: [
          {
            label: "Task Ongoing",
            value: Task.ongoing || 0,
            border: "border-yellow-500",
            text: "text-yellow-600",
            link: "/Dashboard",
          },
        ],
      },
      {
        title: "Completed Task",
         titleColor: "text-green-600",
        cards: [
          {
            label: "Task Completed",
            value: Task.completed || 0,
            border: "border-green-500",
            text: "text-green-600",
            link: "/Dashboard",
          },
        ],
      },
      {
        title: "Missed Task",
         titleColor: "text-red-600",
        cards: [
          {
            label: "Task Missed",
            value: Task.missed || 0,
            border: "border-red-500",
            text: "text-red-600",
            link: "/Dashboard",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    if (!token) return;
    tryCatchWrapper(() => dispatch(EmployeeTask(token)).unwrap());
  }, [dispatch, token]);
  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img src={logo} alt="Loading" className="rounded-full h-28 w-28" />
          </div>
        </div>
      ) : data.stats?.length === 0 ? (
        <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
          <No_data_found />
        </div>
      ) : (
        <div className="px-4 w-full py-6 sm:px-6 lg:px-8 ">
          <h2 className="text-3xl sm:text-4xl font-bold text-white-600">
            Total Tasks <span className={`${data.text}`}>{data.total}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {data.stats.map((stat, i) => (
              <div key={i}>
                <h3 className={`text-center text-md sm:text-lg font-semibold mb-4 ${stat.titleColor}`}>
                  {stat.title}
                </h3>

                {stat.cards.map((card, index) => (
                  <Link to={card.link} key={index}>
                    <Card
                      className={`mb-4 border-2 ${card.border} transition-all duration-300 hover:shadow-xl cursor-pointer`}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                         <p className={`text-sm sm:text-base font-medium ${stat.titleColor}`}>

                            {card.label}
                          </p>
                          <p className={`font-bold text-xl ${card.text}`}>
                            {card.value}
                          </p>
                        </div>
                        <ChevronRight className="text-gray-600" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Task;
