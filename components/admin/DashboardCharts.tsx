"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface MemberGrowthData {
  month: string;
  count: number;
}

interface DashboardChartsProps {
  memberGrowth: MemberGrowthData[];
  upcomingEvents: {
    id: string;
    title: string;
    startDate: Date;
    location: string | null;
  }[];
  ageDistribution: {
    label: string;
    count: number;
    percentage: number;
  }[];
  genderDistribution: {
    male: number;
    female: number;
  };
}

export default function DashboardCharts({
  memberGrowth,
  upcomingEvents,
  ageDistribution,
  genderDistribution,
}: DashboardChartsProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const maxCount = Math.max(...memberGrowth.map((d) => d.count), 1);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Check if a day has events
  const getEventsForDay = (day: number) => {
    return upcomingEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const totalGender = genderDistribution.male + genderDistribution.female;
  const malePercentage = totalGender > 0 ? Math.round((genderDistribution.male / totalGender) * 100) : 50;
  const femalePercentage = 100 - malePercentage;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Member Growth Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Member Growth (Last 6 Months)</h3>
        <div className="h-48 flex items-end gap-2">
          {memberGrowth.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: "160px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--accent)] to-[var(--accent)]/70 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(data.count / maxCount) * 100}%` }}
                >
                  {data.count > 0 && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700">
                      {data.count}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Demographics</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <div>
            <p className="text-sm text-gray-500 mb-3">Gender Distribution</p>
            <div className="relative w-24 h-24 mx-auto">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray={`${femalePercentage} ${100 - femalePercentage}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeDasharray={`${malePercentage} ${100 - malePercentage}`}
                  strokeDashoffset={`-${femalePercentage}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                <span className="text-xs text-gray-600">Male {malePercentage}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-xs text-gray-600">Female {femalePercentage}%</span>
              </div>
            </div>
          </div>

          {/* Age Distribution */}
          <div>
            <p className="text-sm text-gray-500 mb-3">Age Distribution</p>
            <div className="space-y-2">
              {ageDistribution.map((age, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{
                    backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]
                  }} />
                  <span className="text-xs text-gray-600 flex-1">{age.label}</span>
                  <span className="text-xs font-medium text-gray-900">{age.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{monthName}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            const isToday =
              day === new Date().getDate() &&
              currentMonth.getMonth() === new Date().getMonth() &&
              currentMonth.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative ${
                  day ? "hover:bg-gray-50" : ""
                } ${isToday ? "bg-[var(--accent)] text-white" : "text-gray-700"}`}
              >
                {day}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isToday ? "bg-white" : "bg-[var(--accent)]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
          ) : (
            upcomingEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                {event.location && (
                  <p className="text-xs text-gray-400 mt-0.5">{event.location}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
