import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck,
  Home,
  Map,
  MessageSquare,
  FolderOpen,
  ClipboardPenLine,
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
      icon: <BookOpen size={20} />,
      active: isNavItemActive(pathname, "/lesson"),
      position: "top",
    },
    {
      name: "Нийтлэл",
      href: "/communicate/student_post",
      icon: <ClipboardPenLine size={20} />,
      active: isNavItemActive(pathname, "/communicate/student_post"),
      position: "top",
    },
    {
      name: "Мессеж",
      href: "/communicate/user",
      icon: <MessageSquare size={20} />,
      active: isNavItemActive(pathname, "/communicate/user"),
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
      icon: <FolderOpen size={20} />,
      active: isNavItemActive(pathname, "/assignment"),
      position: "top",
    },
  ];
};
