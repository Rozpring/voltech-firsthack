//設定画面
import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">設定</h2>
      
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">通知</h3>
          <p className="mt-1 text-sm text-slate-500">通知の受け取り方を管理します。</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input id="email-notifs" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" defaultChecked />
              <label htmlFor="email-notifs" className="ml-2 block text-sm text-slate-700">メール通知</label>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">外観</h3>
          <p className="mt-1 text-sm text-slate-500">アプリの見た目をカスタマイズします。</p>
           <div className="mt-4">
             <span className="text-sm text-slate-500">テーマ選択機能は近日公開予定です。</span>
           </div>
        </div>
      </div>
    </div>
  );
};