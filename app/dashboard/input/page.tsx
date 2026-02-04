"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Database } from "@/types/database";

type TransactionType = "income" | "expense";

export default function InputPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const expenseCategories = [
    "食費",
    "交通費",
    "娯楽",
    "日用品",
    "医療費",
    "光熱費",
    "通信費",
    "家賃",
    "教育",
    "その他",
  ];

  const incomeCategories = ["給与", "ボーナス", "副業", "投資", "その他"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setError(null);
    setLoading(true);

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("金額を正しく入力してください");
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from("transactions")
        .insert([
          {
            user_id: user.id,
            type: transactionType,
            amount: amountValue,
            category_id: 1, // TODO: カテゴリーIDを選択に応じて取得する
            memo: note || null,
            date: date,
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setAmount("");
      setCategory("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);

      setTimeout(() => {
        setSuccess(false);
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error inserting transaction:", err);
      setError("取引の登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">ためるん</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">取引を追加</h2>

        {/* 成功メッセージ */}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">登録しました！</p>
          </div>
        )}

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 収入/支出の選択 - サイズ統一 */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                種類
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType("income");
                    setCategory("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-4 text-base font-medium transition-colors ${
                    transactionType === "income"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <PlusCircle className="h-5 w-5" />
                  収入
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType("expense");
                    setCategory("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-4 text-base font-medium transition-colors ${
                    transactionType === "expense"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <MinusCircle className="h-5 w-5" />
                  支出
                </button>
              </div>
            </div>

            {/* 金額 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                金額
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="1"
                placeholder="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* カテゴリー */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                カテゴリー
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {(transactionType === "expense"
                  ? expenseCategories
                  : incomeCategories
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* メモ */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                メモ（任意）
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例：ランチ代、電車賃"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 日付 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                日付
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "登録中..." : "登録"}
            </button>
          </form>
        </div>
      </main>

      {/* フッターナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-around p-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <span className="text-lg">🏠</span>
              <span>ホーム</span>
            </button>
            <button
              onClick={() => router.push("/history")}
              className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <span className="text-lg">📋</span>
              <span>履歴</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/input")}
              className="flex flex-col items-center text-sm text-blue-600"
            >
              <span className="text-lg">➕</span>
              <span className="font-medium">入力</span>
            </button>
            <button
              onClick={() => router.push("/stats")}
              className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <span className="text-lg">📊</span>
              <span>グラフ</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/goals")}
              className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <span className="text-lg">🎯</span>
              <span>目標</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
