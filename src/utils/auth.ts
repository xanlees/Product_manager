export const saveToken = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  };
  
  export const getToken = () => localStorage.getItem("access_token");
  
  export const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      
      const data = await response.json();
      if (response.ok) {
        saveToken(data.access, refresh);
        return data.access;
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return null;
      }
    } catch {
      return null;
    }
  };
  