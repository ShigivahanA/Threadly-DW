import { useToastContext } from '../components/providers/ToastProvider'

const useToast = () => {
  return useToastContext()
}

export default useToast
