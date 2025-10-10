import { Router } from 'express';
import { adminControlUserDetails,adminControlUserDetailsUpdate,adminControlUserPasswordUpdate} from '../../../auth';
import { errorCategories as EC } from '../../../testSamples';
const router = Router();

router.get('/v1/admin/controluser/details', (req,res)=>{
  const Id=req.header('ControlUserSessionId');
  if(!Id){
    return res.status(401).json({error:'ControlUserSessionId is invalid',errorCategory:EC.INVALID_CREDENTIALS});
  }
  const sessionId=parseInt(Id as string);
  if (isNaN(sessionId)) {
    return res.status(401).json({ error: 'ControlUserSessionId is not a number', errorCategory: EC.INVALID_CREDENTIALS });
  }
  const result=adminControlUserDetails(sessionId);
  if('error' in result){
    return res.status(401).json({error:result.error,errorCategory:result.errorCategory});
  }else{
    return res.status(200).json({user:result.user});
  }
});//if head is invalid(sessionid->NaN)
router.put('/v1/admin/controluser/details', (req,res)=>{
  const Id=req.header('ControlUserSessionId');
  if(!Id){
    return res.status(401).json({error:'ControlUserSessionId is invalid',errorCategory:EC.INVALID_CREDENTIALS});
  }
  const sessionId=parseInt(Id as string);
  if (isNaN(sessionId)) {
    return res.status(401).json({ error: 'ControlUserSessionId is not a number', errorCategory: EC.INVALID_CREDENTIALS });
  }
    const {email,nameFirst,nameLast}=req.body;
    const result=adminControlUserDetailsUpdate(sessionId,email,nameFirst,nameLast);
    if('error' in result){
      if(result.errorCategory===EC.BAD_INPUT){
        return res.status(400).json({error:result.error,errorCategory:result.errorCategory});
      }else{
          return res.status(401).json({error:result.error,errorCategory:result.errorCategory})
      }
    }
    return res.status(200).json({});
});
router.put('/v1/admin/controluser/password', (req,res)=>{
  const Id=req.header('ControlUserSessionId');
  if(!Id){
    return res.status(401).json({error:'ControlUserSessionId is invalid',errorCategory:EC.INVALID_CREDENTIALS});
  }
  const sessionId=parseInt(Id as string);
  if (isNaN(sessionId)) {
    return res.status(401).json({ error: 'ControlUserSessionId is not a number', errorCategory: EC.INVALID_CREDENTIALS });
  }
  const{oldPassword,newPassword}=req.body;
  const result=adminControlUserPasswordUpdate(sessionId,oldPassword,newPassword);
  if('error' in result){
    if(result.errorCategory===EC.INVALID_CREDENTIALS){
      return res.status(401).json({error:result.error,errorCategory:result.errorCategory});
    }else{
        return res.status(400).json({error:result.error,errorCategory:result.errorCategory})
    }
  }
  return res.status(200).json({});
});

export default router;
