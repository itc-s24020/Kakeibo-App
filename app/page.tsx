import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* ヘッダー */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐻</span>
            <span className="text-2xl font-bold text-gray-800">ためるん</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              無料で始める
            </Link>
          </div>
        </nav>
      </header>

      {/* ヒーローセクション */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="text-8xl mb-8">🐻💰</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            楽しく貯める、
            <br />
            計画的に管理する
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            「今月いくら使ったか分からない」「なかなか貯金ができない」
            <br />
            そんな悩みを解決する、シンプルな家計簿アプリです。
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 font-medium transition shadow-lg hover:shadow-xl"
          >
            今すぐ無料で始める →
          </Link>
        </div>

        {/* 特徴セクション */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">見える化</h3>
            <p className="text-gray-600">
              支出をグラフで可視化。どこにお金を使っているか一目で分かります。
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">目標設定</h3>
            <p className="text-gray-600">
              具体的な貯金目標を設定して、達成率をリアルタイムで確認できます。
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">予算管理</h3>
            <p className="text-gray-600">
              カテゴリー別に予算を設定。使いすぎる前に通知でお知らせします。
            </p>
          </div>
        </div>

        {/* CTAセクション */}
        <div className="text-center mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            さあ、始めましょう
          </h2>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 font-medium transition"
          >
            無料アカウントを作成
          </Link>
        </div>
      </main>

      {/* フッター */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 ためるん. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
