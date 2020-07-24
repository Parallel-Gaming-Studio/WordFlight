SELECT  [word], [sponsor_name]
	FROM [FlyWithButchOhareDB_Copy].[dbo].[wordflightwords] A
	JOIN [FlyWithButchOhareDB_Copy].[dbo].[wordflightsponsors] B
		ON A.[sponsor_id]=B.[sponsor_id]
	WHERE [word]
		NOT IN ('')
	ORDER BY NEWID();