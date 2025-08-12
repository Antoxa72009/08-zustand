'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import css from './TagsMenu.module.css';
import { NoteTag } from '@/types/note';

const tags: Array<NoteTag | 'All'> = ['All', 'Todo', 'Work', 'Personal', 'Shopping', 'Meeting'];

const TagsMenu = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu} aria-expanded={isOpen}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList} onMouseLeave={closeMenu}>
          {tags.map((tag) => {
            const href = `/notes/filter/${encodeURIComponent(tag)}`;
            const isActive = pathname?.startsWith(`/notes/filter/${tag}`);
            return (
              <li key={tag} className={css.menuItem}>
                <Link
                  href={href}
                  className={`${css.menuLink} ${isActive ? css.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;