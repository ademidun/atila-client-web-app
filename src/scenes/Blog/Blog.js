import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogsList from './BlogsList';
import BlogDetail from './BlogDetail';
import BlogAddEdit from './BlogAddEdit';

function Blog() {
  return (
    <Routes>
      <Route path="add" element={<BlogAddEdit />} />
      <Route path="edit/:username/:slug" element={<BlogAddEdit />} />
      <Route path=":username/:slug" element={<BlogDetail />} />
      <Route index element={<BlogsList />} />
    </Routes>
  );
}

export default Blog;
