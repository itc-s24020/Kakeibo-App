"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("ユーザー認証確認中...");
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("認証エラー:", error);
          router.push("/auth/login");
          return;
        }

        if (!user) {
          console.log("未ログイン、ログインページへリダイレクト");
          router.push("/auth/login");
          return;
        }

        console.log("ログイン済み:", user.email);
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error("予期しないエラー:", error);
        router.push("/auth/login");
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        console.log("セッション切れ、ログインページへ");
        router.push("/auth/login");
      } else {
        console.log("セッション有効:", session.user.email);
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    console.log("ログアウト処理開始");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("ログアウトエラー:", error);
      } else {
        console.log("ログアウト成功");
        router.push("/");
      }
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐻</span>
              <span className="text-2xl font-bold text-gray-800">ためるん</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ようこそ、ダッシュボードへ！🎉
            </h1>
            <p className="text-gray-600 mb-6">
              ログインユーザー:{" "}
              <span className="font-semibold">{user.email}</span>
            </p>
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <p className="text-gray-700">
                ✅ 認証機能が正常に動作しています！
              </p>
            </div>
          </div>

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
