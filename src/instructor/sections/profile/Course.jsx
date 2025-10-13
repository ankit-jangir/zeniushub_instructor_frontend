import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAssignBatchSubject } from '@/instructor/Redux/Api/Batch_Api';
import tryCatchWrapper from '@/instructor/utils/TryCatchHandler';
import { Clock } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { Layers } from 'lucide-react';
import React from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const Course = () => {
  const dispatch = useDispatch();
  const { empCourse, loadingEmp } = useSelector(
    (state) => state.Batch
  );



  const fetchAssignBatchSubjects = async () => {

    await tryCatchWrapper(() =>

      dispatch(fetchAssignBatchSubject()).unwrap())

  };

  useEffect(() => {
    fetchAssignBatchSubjects();
  }, []);

  const emp_batches = empCourse?.employeeBatchSubject[0]?.emp_batches || [];
  const emp_subjects = empCourse?.employeeBatchSubject[0]?.subjects || [];
  return (
    <div className="p-6 min-h-screen">
      {emp_batches.length === 0 && emp_subjects.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No courses assigned.
        </p>
      ) : (
        <>
          <h3 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-10 mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 sm:h-6 sm:w-6" /> Batches
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {emp_batches.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full text-sm sm:text-base">
                No batches assigned.
              </p>
            ) : (
              emp_batches.map((batch, index) => (
                <Card
                  key={index}
                  className="shadow-md dark:shadow-md dark:shadow-blue-400/50 border box-border overflow-hidden max-w-full"
                >
                  <CardHeader className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="max-w-[80%]">
                        <CardTitle className="text-md sm:text-lg truncate w-[300px]" title={batch?.batch?.BatchesName}>
                          {batch?.batch?.BatchesName || "N/A"}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground truncate w-[300px]" title={batch?.batch?.Course?.course_name}>
                          {batch?.batch?.Course?.course_name ||
                            "No Course"}
                        </CardDescription>
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent className="text-xs sm:text-sm p-3">
                    <p className="flex items-center gap-2 truncate">
                      <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="truncate">
                        {batch?.batch?.StartTime || "N/A"} -{" "}
                        {batch?.batch?.EndTime || "N/A"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 mt-2 truncate">
                      <BadgeCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="truncate">
                        Status: {batch?.batch?.status || "N/A"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-10 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" /> Subjects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {emp_subjects.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full text-sm sm:text-base">
                No subjects assigned.
              </p>
            ) : (
              emp_subjects.map((subj, index) => (
                <Card
                  key={index}
                  className="shadow-md dark:shadow-md dark:shadow-blue-400/50 border box-border overflow-hidden max-w-full"
                >
                  <CardHeader className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="max-w-[80%]">
                        <CardTitle className="text-md sm:text-lg truncate w-[300px]" title={subj?.Subject?.subject_name}>
                          {subj?.Subject?.subject_name || "N/A"}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground truncate w-[300px]" title={subj?.Course?.course_name}>
                          {subj?.Course?.course_name || "No Course"}
                        </CardDescription>
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent className="text-xs sm:text-sm p-3">
                    <p className="flex items-center gap-2 truncate">
                      <BadgeCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="truncate">
                        Status: {subj?.Subject?.status || "N/A"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Course
