﻿vec2 uvOffset = vec2(0.0, 0.0);

#if defined(BUMP) || defined(PARALLAX)
	#ifdef NORMALXYSCALE
		float normalScale = 1.0;
	#else		
		float normalScale = vBumpInfos.y;
	#endif

	#if defined(TANGENT) && defined(NORMAL)
		mat3 TBN = vTBN;
	#else
		mat3 TBN = cotangent_frame(normalW * normalScale, vPositionW, vBumpUV);
	#endif
#endif

#ifdef PARALLAX
	mat3 invTBN = transposeMat3(TBN);

	#ifdef PARALLAXOCCLUSION
		uvOffset = parallaxOcclusion(invTBN * -viewDirectionW, invTBN * normalW, vBumpUV, vBumpInfos.z);
	#else
		uvOffset = parallaxOffset(invTBN * viewDirectionW, vBumpInfos.z);
	#endif
#endif

#ifdef BUMP
#ifdef OBJECTSPACE_NORMALMAP
	normalW = normalize(texture2D(bumpSampler, vBumpUV).xyz  * 2.0 - 1.0);
	normalW = normalize(mat3(normalMatrix) * normalW);	
#else
	normalW = perturbNormal(TBN, vBumpUV + uvOffset);
#endif
#endif