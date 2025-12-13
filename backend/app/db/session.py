from fastapi import Request

def get_db(request: Request):
    """
    アプリケーションのライフサイクル中に作成された
    DBセッションファクトリ(SessionLocal)をapp.stateから取得し、
    リクエストごとに独立したDBセッションを提供する。
    """
    SessionLocal = request.app.state.SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()