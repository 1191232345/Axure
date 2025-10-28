/**
 * 浮动按钮与模态框交互逻辑
 * 用法：
 * 1. 引入CSS文件和此JS文件
 * 2. 创建符合HTML结构要求的元素
 * 3. 调用initFloatingWidgets()函数初始化
 */

class FloatingWidgets {
  constructor() {
    this.widgets = null;
    this.modals = null;
    this.closeButtons = null;
  }
  
  /**
   * 初始化浮动按钮组件
   */
  init() {
    // 获取元素
    this.widgets = document.querySelectorAll('.floating-btn');
    this.modals = document.querySelectorAll('.modal-overlay');
    this.closeButtons = document.querySelectorAll('.close-btn');
    
    // 绑定事件监听器
    this._bindEventListeners();
  }
  
  /**
   * 绑定所有事件监听器
   * @private
   */
  _bindEventListeners() {
    // 为每个浮动按钮添加点击事件
    if (this.widgets && this.widgets.length > 0) {
      this.widgets.forEach(button => {
        button.addEventListener('click', (e) => {
          const modalId = button.getAttribute('data-modal-id');
          if (modalId) {
            this.showModal(modalId);
          }
        });
      });
    }
    
    // 为所有关闭按钮添加点击事件
    if (this.closeButtons && this.closeButtons.length > 0) {
      this.closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const modal = button.closest('.modal-overlay');
          if (modal) {
            this.hideModal(modal.id);
          }
        });
      });
    }
    
    // 为模态框添加点击背景关闭功能
    if (this.modals && this.modals.length > 0) {
      this.modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
          // 只有点击背景而不是内容区域时才关闭
          if (e.target === modal) {
            this.hideModal(modal.id);
          }
        });
      });
    }
    
    // 添加ESC键关闭模态框的功能
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideAllModals();
      }
    });
  }
  
  /**
   * 显示指定的模态框
   * @param {string} modalId - 模态框的ID
   */
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
      
      // 修复iOS Safari上的滚动问题
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // 触发自定义事件
      this._dispatchEvent('modalShown', modal);
    }
  }
  
  /**
   * 隐藏指定的模态框
   * @param {string} modalId - 模态框的ID
   */
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      
      // 延迟恢复滚动，让动画完成
      setTimeout(() => {
        // 检查是否还有其他打开的模态框
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        if (activeModals.length === 0) {
          // 恢复背景滚动
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }
      }, 300); // 与CSS过渡时间匹配
      
      // 触发自定义事件
      this._dispatchEvent('modalHidden', modal);
    }
  }
  
  /**
   * 隐藏所有打开的模态框
   */
  hideAllModals() {
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    
    activeModals.forEach(modal => {
      modal.classList.remove('active');
    });
    
    // 延迟恢复滚动，让动画完成
    setTimeout(() => {
      // 恢复背景滚动
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }, 300); // 与CSS过渡时间匹配
  }
  
  /**
   * 触发自定义事件
   * @param {string} eventName - 事件名称
   * @param {HTMLElement} target - 目标元素
   * @private
   */
  _dispatchEvent(eventName, target) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: {
        target: target
      }
    });
    
    target.dispatchEvent(event);
  }
}

/**
 * 初始化浮动按钮组件的公共函数
 * @returns {FloatingWidgets} - 返回FloatingWidgets实例，便于链式调用或进一步控制
 */
function initFloatingWidgets() {
  const widgets = new FloatingWidgets();
  widgets.init();
  return widgets;
}

// 文档加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingWidgets);
} else {
  // 文档已经加载完成，直接初始化
  initFloatingWidgets();
}

// 导出类和初始化函数，支持模块化使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FloatingWidgets, initFloatingWidgets };
}

// 支持ES模块
if (typeof define === 'function' && define.amd) {
  define('floatingWidgets', [], function() {
    return { FloatingWidgets, initFloatingWidgets };
  });
}