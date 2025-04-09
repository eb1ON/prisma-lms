import { usePathname } from "next/navigation";

import {
  BarChart,
  Book,
  CalendarCheck,
  GraduationCap,
  Home,
  Map,
  MessageSquare,
  Pencil,
  Settings,
} from "lucide-react";

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: "Нүүр хуудас",
      href: "/home",
      icon: <Home size={20} />,
      active: pathname === "/home",
      position: "top",
    },
    {
      name: "Сургалтын агуулга",
      href: "/roadmap",
      icon: <Map size={20} />,
      active: isNavItemActive(pathname, "/roadmap"),
      position: "top",
    },
    {
      name: "Хичээл",
      href: "/lesson",
      icon: <Book size={20} />,
      active: isNavItemActive(pathname, "/class"),
      position: "top",
    },
    {
      name: "Харилцаа холбоо",
      href: "/communicate/student_post",
      icon: <MessageSquare size={20} />,
      active: isNavItemActive(pathname, "/communicate"),
      position: "top",
    },
    {
      name: "Хуанли",
      href: "/schedule",
      icon: <CalendarCheck size={20} />,
      active: isNavItemActive(pathname, "/schedule"),
      position: "top",
    },
    {
      name: "Даалгавар",
      href: "/assignment",
      icon: <Pencil size={20} />,
      active: isNavItemActive(pathname, "/assignment"),
      position: "top",
    },
  ];
};
