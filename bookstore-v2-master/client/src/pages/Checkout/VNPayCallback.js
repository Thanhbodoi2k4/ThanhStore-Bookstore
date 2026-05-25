import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import orderApi from "../../api/orderApi"

export default function VNPayCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const verify = async () => {
            try {
                const params = Object.fromEntries([...searchParams])
                await orderApi.verifyVNPay(params)
                navigate({ pathname: '/don-hang' })
            } catch (error) {
                console.log(error)
                navigate({ pathname: '/don-hang' })
            }
        }
        verify()    
    }, [searchParams, navigate])

    return <h1>Đang xử lý thanh toán VNPay...</h1>
}
