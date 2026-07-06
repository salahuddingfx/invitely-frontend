import { create } from 'zustand';
import { mockTemplates, Template } from '../mock/templates';
import { mockCategories, Category } from '../mock/categories';

interface TemplateState {
  templates: Template[];
  categories: Category[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  getTemplateById: (id: string) => Template | undefined;
  getFilteredTemplates: () => Template[];
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: mockTemplates,
  categories: mockCategories,
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  getTemplateById: (id) => get().templates.find((tpl) => tpl.id === id),
  getFilteredTemplates: () => {
    const { templates, selectedCategoryId } = get();
    if (!selectedCategoryId) return templates;
    return templates.filter((tpl) => tpl.categoryId === selectedCategoryId);
  }
}));
