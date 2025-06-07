import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session){
                navigate("/login");
            }
            setLoading(false);
        });
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return children;
}