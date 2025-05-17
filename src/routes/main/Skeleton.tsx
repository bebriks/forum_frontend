import '../../App.scss'
import { Skeleton } from '@mui/material'

function Skelet() {

  return (
    <>
        {/* <Skeleton variant="rounded" sx={{ width: '100%', minHeight: '100px', height: '20%', marginBottom: '20px' }} /> */}
        <div style={{ display: 'flex', flexFlow: 'column', width: '100%', gap: 20, alignItems: 'center' }}>
            <Skeleton variant="rounded" sx={{ width: '50%', minHeight: '180px', height: '20%' }} />
            <Skeleton variant="rounded" sx={{ width: '50%', minHeight: '180px', height: '20%' }} />
            <Skeleton variant="rounded" sx={{ width: '50%', minHeight: '180px', height: '20%' }} />
            <Skeleton variant="rounded" sx={{ width: '50%', minHeight: '180px', height: '20%' }} />
        </div>
    </>
  )
}

export default Skelet