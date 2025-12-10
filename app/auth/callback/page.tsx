"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("コールバック処理開始");

        // URLからハッシュを取得
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        console.log("アクセストークン:", accessToken ? "存在" : "無し");

        if (accessToken && refreshToken) {
          // トークンを使ってセッションを設定
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("セッション設定エラー:", error);
            setErrorMessage(error.message);
            setStatus("error");
            return;
          }

          console.log("認証成功");
          setStatus("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          // URLパラメータからcodeを確認（OAuth flow用）
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");

          if (code) {
            console.log("認証コード:", code);
            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
              console.error("コード交換エラー:", error);
              setErrorMessage(error.message);
              setStatus("error");
              return;
            }

            console.log("認証成功（コード交換）");
            setStatus("success");
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          } else {
            console.error("トークンもコードも見つかりません");
            setErrorMessage("認証情報が見つかりませんでした");
            setStatus("error");
          }
        }
      } catch (error) {
        console.error("コールバックエラー:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "不明なエラー"
        );
        setStatus("error");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <>
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">確認中...</h2>
            <p className="text-gray-600">アカウントを確認しています</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              確認完了！
            </h2>
            <p className="text-gray-600 mb-6">
              アカウントが有効化されました。
              <br />
              ダッシュボードにリダイレクトしています...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">エラー</h2>
            <p className="text-gray-600 mb-4">確認に失敗しました。</p>
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {errorMessage}
              </div>
            )}
            <p className="text-gray-600 mb-6 text-sm">
              リンクが無効か、期限切れの可能性があります。
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              ログインページへ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
