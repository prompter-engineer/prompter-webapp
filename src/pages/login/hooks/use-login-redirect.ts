export const useLoginRedirect = () => {
  const navigate = useNavigate()

  return () => {
    navigate('/')
  }
}
