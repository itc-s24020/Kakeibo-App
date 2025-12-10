"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐻</span>
              <span className="text-2xl font-bold text-gray-800">ためるん</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ようこそ、ダッシュボードへ！
            </h1>
            <p className="text-gray-600 mb-6">
              ログインユーザー: {user?.email}
            </p>
            <div className="p-6 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                🎉 認証機能が正常に動作しています！
                <br />
                ここに家計簿の機能を実装していきます。
              </p>
            </div>
          </div>

          {/* 今後追加される機能のプレビュー */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">収支管理</h3>
              <p className="text-gray-600 text-sm">
                日々の収入・支出を記録して管理します
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">レポート</h3>
              <p className="text-gray-600 text-sm">
                月次・年次のレポートをグラフで確認
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">目標設定</h3>
              <p className="text-gray-600 text-sm">
                貯金目標を設定して進捗を追跡
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
