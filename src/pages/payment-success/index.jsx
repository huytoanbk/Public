import { useEffect } from "react"

export default function PaymentSuccess() {
    useEffect(() => {
        setTimeout(() => {
            window.close();
        }, 500)
    }, []);
    return <>
    </>
}