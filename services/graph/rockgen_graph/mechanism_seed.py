"""ALS disease mechanism graph seed — run as ordered Cypher statements."""

STATEMENTS: list[str] = [
    """
MERGE (ax_cyto:DiseaseAxis {id: 'cytoskeleton'})
SET ax_cyto.name = 'Cytoskeleton', ax_cyto.description = 'Actin / microtubule integrity'
MERGE (ax_rna:DiseaseAxis {id: 'rna_metabolism'})
SET ax_rna.name = 'RNA metabolism', ax_rna.description = 'RNA processing, splicing, stress granules'
MERGE (ax_ph:DiseaseAxis {id: 'protein_homeostasis'})
SET ax_ph.name = 'Protein homeostasis', ax_ph.description = 'Folding, aggregation, clearance'
MERGE (ax_ax:DiseaseAxis {id: 'axonal_transport'})
SET ax_ax.name = 'Axonal transport', ax_ax.description = 'Cargo trafficking along axons'
MERGE (ax_mito:DiseaseAxis {id: 'mitochondria'})
SET ax_mito.name = 'Mitochondria', ax_mito.description = 'Energy metabolism and mitochondrial quality'
MERGE (ax_ni:DiseaseAxis {id: 'neuroinflammation'})
SET ax_ni.name = 'Neuroinflammation', ax_ni.description = 'Glial activation and inflammatory signaling'
WITH ax_cyto, ax_rna, ax_ph, ax_ax, ax_mito, ax_ni
MATCH (disease:Disease {slug: 'als'})
MERGE (ax_cyto)-[:PART_OF]->(disease)
MERGE (ax_rna)-[:PART_OF]->(disease)
MERGE (ax_ph)-[:PART_OF]->(disease)
MERGE (ax_ax)-[:PART_OF]->(disease)
MERGE (ax_mito)-[:PART_OF]->(disease)
MERGE (ax_ni)-[:PART_OF]->(disease)
""",
    """
MERGE (m_agg:Mechanism {id: 'aggregation'})
SET m_agg.name = 'Protein aggregation', m_agg.description = 'Toxic oligomers / aggregates'
MERGE (m_misfold:Mechanism {id: 'misfolding'})
SET m_misfold.name = 'Protein misfolding', m_misfold.description = 'Loss of native fold'
MERGE (m_cyto_d:Mechanism {id: 'cytoskeleton_disruption'})
SET m_cyto_d.name = 'Cytoskeleton disruption', m_cyto_d.description = 'Actin / microtubule network failure'
MERGE (m_mt:Mechanism {id: 'microtubule_instability'})
SET m_mt.name = 'Microtubule instability', m_mt.description = 'Unstable tubulin polymers'
MERGE (m_rna:Mechanism {id: 'rna_metabolism'})
SET m_rna.name = 'RNA metabolism dysregulation', m_rna.description = 'RNA binding / splicing / RNP defects'
MERGE (m_sg:Mechanism {id: 'stress_granules'})
SET m_sg.name = 'Stress granule dysfunction', m_sg.description = 'Pathologic stress granules'
MERGE (m_ax:Mechanism {id: 'axonal_transport'})
SET m_ax.name = 'Axonal transport defects', m_ax.description = 'Impaired axonal trafficking'
MERGE (m_mn:Mechanism {id: 'motor_neuron_death'})
SET m_mn.name = 'Motor neuron death', m_mn.description = 'Progressive MN degeneration'
MERGE (m_auto:Mechanism {id: 'autophagy_lysosome'})
SET m_auto.name = 'Autophagy / clearance defect', m_auto.description = 'Impaired protein / organelle clearance'
MERGE (m_inflam:Mechanism {id: 'neuroinflammation'})
SET m_inflam.name = 'Neuroinflammation', m_inflam.description = 'Innate immune activation in CNS'
MERGE (m_mito:Mechanism {id: 'mitochondrial_dysfunction'})
SET m_mito.name = 'Mitochondrial dysfunction', m_mito.description = 'Bioenergetic failure'
WITH m_agg, m_misfold, m_cyto_d, m_mt, m_rna, m_sg, m_ax, m_mn, m_auto, m_inflam, m_mito
MATCH (ax_cyto:DiseaseAxis {id: 'cytoskeleton'})
MATCH (ax_rna:DiseaseAxis {id: 'rna_metabolism'})
MATCH (ax_ph:DiseaseAxis {id: 'protein_homeostasis'})
MATCH (ax_ax:DiseaseAxis {id: 'axonal_transport'})
MATCH (ax_mito:DiseaseAxis {id: 'mitochondria'})
MATCH (ax_ni:DiseaseAxis {id: 'neuroinflammation'})
MERGE (m_agg)-[:IN_AXIS]->(ax_ph)
MERGE (m_misfold)-[:IN_AXIS]->(ax_ph)
MERGE (m_auto)-[:IN_AXIS]->(ax_ph)
MERGE (m_cyto_d)-[:IN_AXIS]->(ax_cyto)
MERGE (m_mt)-[:IN_AXIS]->(ax_cyto)
MERGE (m_rna)-[:IN_AXIS]->(ax_rna)
MERGE (m_sg)-[:IN_AXIS]->(ax_rna)
MERGE (m_ax)-[:IN_AXIS]->(ax_ax)
MERGE (m_mito)-[:IN_AXIS]->(ax_mito)
MERGE (m_inflam)-[:IN_AXIS]->(ax_ni)
MERGE (m_misfold)-[:LEADS_TO]->(m_agg)
MERGE (m_agg)-[:LEADS_TO]->(m_cyto_d)
MERGE (m_mt)-[:LEADS_TO]->(m_ax)
MERGE (m_cyto_d)-[:LEADS_TO]->(m_ax)
MERGE (m_rna)-[:LEADS_TO]->(m_sg)
MERGE (m_ax)-[:LEADS_TO]->(m_mn)
MERGE (m_agg)-[:LEADS_TO]->(m_mn)
MERGE (m_sg)-[:LEADS_TO]->(m_mn)
""",
    """
MATCH (ph_a:Phenotype {id: 'aggregation'})
MATCH (m_agg:Mechanism {id: 'aggregation'})
MERGE (ph_a)-[:MAPS_TO]->(m_agg)
""",
    """
MATCH (ph_m:Phenotype {id: 'misfolding'})
MATCH (m_misfold:Mechanism {id: 'misfolding'})
MERGE (ph_m)-[:MAPS_TO]->(m_misfold)
""",
    """
MATCH (ph_s:Phenotype {id: 'structural_change'})
MATCH (m_misfold:Mechanism {id: 'misfolding'})
MERGE (ph_s)-[:MAPS_TO]->(m_misfold)
""",
    """
MERGE (g_tuba:Gene {symbol: 'TUBA4A'})
SET g_tuba.name = 'Tubulin alpha-4A', g_tuba.chromosome = '2q35'
MERGE (p_tuba:Protein {uniprot_id: 'P68366'})
SET p_tuba.symbol = 'TUBA4A',
    p_tuba.name = 'Tubulin alpha-4A chain',
    p_tuba.organism = 'Homo sapiens',
    p_tuba.length = 448,
    p_tuba.function = 'Major constituent of microtubules; ALS-linked mutants impair microtubule dynamics and axonal transport.'
WITH g_tuba, p_tuba
MATCH (disease:Disease {slug: 'als'})
MERGE (disease)-[:ASSOCIATED_WITH]->(g_tuba)
MERGE (g_tuba)-[:ENCODES]->(p_tuba)
MERGE (mut_r320c:Mutation {key: 'TUBA4A:R320C'})
SET mut_r320c.gene_symbol = 'TUBA4A',
    mut_r320c.protein_uniprot = 'P68366',
    mut_r320c.hgvs_p = 'p.Arg320Cys',
    mut_r320c.position = 320,
    mut_r320c.from_aa = 'R',
    mut_r320c.to_aa = 'C',
    mut_r320c.significance = 'ALS-associated; microtubule polymerization defect',
    mut_r320c.clinvar_status = 'Pathogenic / Likely pathogenic (literature)',
    mut_r320c.structural_region = 'tubulin core / GTP-proximal',
    mut_r320c.binding_context = 'microtubule lattice'
MERGE (mut_r215c:Mutation {key: 'TUBA4A:R215C'})
SET mut_r215c.gene_symbol = 'TUBA4A',
    mut_r215c.protein_uniprot = 'P68366',
    mut_r215c.hgvs_p = 'p.Arg215Cys',
    mut_r215c.position = 215,
    mut_r215c.from_aa = 'R',
    mut_r215c.to_aa = 'C',
    mut_r215c.significance = 'ALS-associated tubulin variant',
    mut_r215c.clinvar_status = 'Likely pathogenic (literature)',
    mut_r215c.structural_region = 'tubulin fold',
    mut_r215c.binding_context = 'microtubule'
MERGE (p_tuba)-[:HAS_MUTATION]->(mut_r320c)
MERGE (p_tuba)-[:HAS_MUTATION]->(mut_r215c)
MERGE (mut_r320c)-[:LINKED_TO]->(disease)
MERGE (mut_r215c)-[:LINKED_TO]->(disease)
MERGE (ph_mt:Phenotype {id: 'microtubule_instability'})
SET ph_mt.name = 'Microtubule instability', ph_mt.description = 'Impaired tubulin polymerization / stability'
MERGE (ph_ax:Phenotype {id: 'axonal_transport_defect'})
SET ph_ax.name = 'Axonal transport defect', ph_ax.description = 'Impaired axonal cargo trafficking'
MERGE (ph_mn:Phenotype {id: 'motor_neuron_injury'})
SET ph_mn.name = 'Motor neuron injury', ph_mn.description = 'Motor neuron dysfunction and death'
MERGE (mut_r320c)-[:CAUSES]->(ph_mt)
MERGE (ph_mt)-[:LEADS_TO]->(ph_ax)
MERGE (ph_ax)-[:LEADS_TO]->(ph_mn)
MERGE (ph_mn)-[:CONTRIBUTES_TO]->(disease)
WITH ph_mt, ph_ax, ph_mn, p_tuba, mut_r320c, disease
MATCH (m_mt:Mechanism {id: 'microtubule_instability'})
MATCH (m_ax:Mechanism {id: 'axonal_transport'})
MATCH (m_mn:Mechanism {id: 'motor_neuron_death'})
MERGE (ph_mt)-[:MAPS_TO]->(m_mt)
MERGE (ph_ax)-[:MAPS_TO]->(m_ax)
MERGE (ph_mn)-[:MAPS_TO]->(m_mn)
MERGE (pw_mt:Pathway {id: 'microtubule-cytoskeleton'})
SET pw_mt.name = 'Microtubule cytoskeleton', pw_mt.source = 'curated'
MERGE (p_tuba)-[:IN_PATHWAY]->(pw_mt)
MERGE (af_tuba:Structure {id: 'AF-P68366-F1'})
SET af_tuba.source = 'AlphaFold',
    af_tuba.url = 'https://alphafold.ebi.ac.uk/entry/P68366',
    af_tuba.method = 'predicted'
MERGE (p_tuba)-[:HAS_STRUCTURE]->(af_tuba)
MERGE (paper_tuba:Paper {id: 'pmid:25374358'})
SET paper_tuba.title = 'Exome sequencing identifies TUBA4A mutations as a cause of familial ALS',
    paper_tuba.year = 2014,
    paper_tuba.journal = 'Neuron',
    paper_tuba.url = 'https://pubmed.ncbi.nlm.nih.gov/25374358/'
MERGE (p_tuba)-[:MENTIONED_IN]->(paper_tuba)
MERGE (mut_r320c)-[:MENTIONED_IN]->(paper_tuba)
MERGE (disease)-[:MENTIONED_IN]->(paper_tuba)
MERGE (prog_tuba:DrugProgram {id: 'als-tuba4a-exploratory'})
SET prog_tuba.name = 'TUBA4A Microtubule Stabilization',
    prog_tuba.stage = 'Discovery',
    prog_tuba.focus = 'Stabilize mutant tubulin / restore axonal transport'
MERGE (prog_tuba)-[:TARGETS_PROTEIN]->(p_tuba)
MERGE (prog_tuba)-[:FOR_DISEASE]->(disease)
""",
    """
MATCH (disease:Disease {slug: 'als'})
MERGE (g_sod1:Gene {symbol: 'SOD1'}) SET g_sod1.name = 'Superoxide dismutase 1'
MERGE (p_sod1:Protein {uniprot_id: 'P00441'}) SET p_sod1.symbol = 'SOD1', p_sod1.name = 'Superoxide dismutase [Cu-Zn]', p_sod1.organism = 'Homo sapiens', p_sod1.panel_depth = 'curated_mechanism'
MERGE (disease)-[:ASSOCIATED_WITH]->(g_sod1) MERGE (g_sod1)-[:ENCODES]->(p_sod1)
MERGE (g_fus:Gene {symbol: 'FUS'}) SET g_fus.name = 'FUS RNA binding protein'
MERGE (p_fus:Protein {uniprot_id: 'P35637'}) SET p_fus.symbol = 'FUS', p_fus.name = 'RNA-binding protein FUS', p_fus.organism = 'Homo sapiens', p_fus.panel_depth = 'curated_mechanism'
MERGE (disease)-[:ASSOCIATED_WITH]->(g_fus) MERGE (g_fus)-[:ENCODES]->(p_fus)
MERGE (g_tdp:Gene {symbol: 'TARDBP'}) SET g_tdp.name = 'TAR DNA-binding protein 43'
MERGE (p_tdp:Protein {uniprot_id: 'Q13148'}) SET p_tdp.symbol = 'TARDBP', p_tdp.name = 'TAR DNA-binding protein 43', p_tdp.organism = 'Homo sapiens', p_tdp.panel_depth = 'curated_mechanism'
MERGE (disease)-[:ASSOCIATED_WITH]->(g_tdp) MERGE (g_tdp)-[:ENCODES]->(p_tdp)
MERGE (g_optn:Gene {symbol: 'OPTN'}) SET g_optn.name = 'Optineurin'
MERGE (p_optn:Protein {uniprot_id: 'Q96CV9'}) SET p_optn.symbol = 'OPTN', p_optn.name = 'Optineurin', p_optn.organism = 'Homo sapiens', p_optn.panel_depth = 'curated_mechanism'
MERGE (disease)-[:ASSOCIATED_WITH]->(g_optn) MERGE (g_optn)-[:ENCODES]->(p_optn)
MERGE (g_tbk1:Gene {symbol: 'TBK1'}) SET g_tbk1.name = 'TANK-binding kinase 1'
MERGE (p_tbk1:Protein {uniprot_id: 'Q9UHD2'}) SET p_tbk1.symbol = 'TBK1', p_tbk1.name = 'Serine/threonine-protein kinase TBK1', p_tbk1.organism = 'Homo sapiens', p_tbk1.panel_depth = 'curated_mechanism'
MERGE (disease)-[:ASSOCIATED_WITH]->(g_tbk1) MERGE (g_tbk1)-[:ENCODES]->(p_tbk1)
MERGE (g_ubq:Gene {symbol: 'UBQLN2'}) SET g_ubq.name = 'Ubiquilin-2'
MERGE (p_ubq:Protein {uniprot_id: 'Q9UHD9'}) SET p_ubq.symbol = 'UBQLN2', p_ubq.name = 'Ubiquilin-2', p_ubq.organism = 'Homo sapiens', p_ubq.panel_depth = 'curated_mechanism'
MERGE (disease)-[:ASSOCIATED_WITH]->(g_ubq) MERGE (g_ubq)-[:ENCODES]->(p_ubq)
""",
    """
MATCH (pfn1:Protein {uniprot_id: 'P07737'})
MATCH (tuba:Protein {uniprot_id: 'P68366'})
MATCH (sod1:Protein {uniprot_id: 'P00441'})
MATCH (fus:Protein {uniprot_id: 'P35637'})
MATCH (tdp:Protein {uniprot_id: 'Q13148'})
MATCH (optn:Protein {uniprot_id: 'Q96CV9'})
MATCH (tbk1:Protein {uniprot_id: 'Q9UHD2'})
MATCH (ubq:Protein {uniprot_id: 'Q9UHD9'})
MATCH (m_agg:Mechanism {id: 'aggregation'})
MATCH (m_misfold:Mechanism {id: 'misfolding'})
MATCH (m_cyto_d:Mechanism {id: 'cytoskeleton_disruption'})
MATCH (m_mt:Mechanism {id: 'microtubule_instability'})
MATCH (m_rna:Mechanism {id: 'rna_metabolism'})
MATCH (m_sg:Mechanism {id: 'stress_granules'})
MATCH (m_ax:Mechanism {id: 'axonal_transport'})
MATCH (m_mn:Mechanism {id: 'motor_neuron_death'})
MATCH (m_auto:Mechanism {id: 'autophagy_lysosome'})
MATCH (m_inflam:Mechanism {id: 'neuroinflammation'})
MATCH (m_mito:Mechanism {id: 'mitochondrial_dysfunction'})
MERGE (pfn1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'G118V/C71G aggregation package'}]->(m_agg)
MERGE (pfn1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Misfolding supported'}]->(m_misfold)
MERGE (pfn1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Actin cytoskeleton'}]->(m_cyto_d)
MERGE (pfn1)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Secondary transport stress'}]->(m_ax)
MERGE (pfn1)-[:IMPLICATED_IN {level: 'low', evidence_note: 'Not primary RNA phenotype'}]->(m_rna)
MERGE (pfn1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Converges on MN death'}]->(m_mn)
MERGE (tuba)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Some mutant tubulin aggregation reports'}]->(m_agg)
MERGE (tuba)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Core microtubule defect'}]->(m_mt)
MERGE (tuba)-[:IMPLICATED_IN {level: 'high', evidence_note: 'MT cytoskeleton'}]->(m_cyto_d)
MERGE (tuba)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Axonal transport heavily implicated'}]->(m_ax)
MERGE (tuba)-[:IMPLICATED_IN {level: 'low', evidence_note: 'Not RNA-centric'}]->(m_rna)
MERGE (tuba)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Converges on MN death'}]->(m_mn)
MERGE (sod1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Classic aggregation genetics'}]->(m_agg)
MERGE (sod1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Misfolding'}]->(m_misfold)
MERGE (sod1)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Mito stress'}]->(m_mito)
MERGE (sod1)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Transport secondary'}]->(m_ax)
MERGE (sod1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'MN death'}]->(m_mn)
MERGE (fus)-[:IMPLICATED_IN {level: 'high', evidence_note: 'RNP / aggregation'}]->(m_agg)
MERGE (fus)-[:IMPLICATED_IN {level: 'high', evidence_note: 'RNA binding'}]->(m_rna)
MERGE (fus)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Stress granules'}]->(m_sg)
MERGE (fus)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Transport secondary'}]->(m_ax)
MERGE (fus)-[:IMPLICATED_IN {level: 'low', evidence_note: 'Not cytoskeleton-primary'}]->(m_cyto_d)
MERGE (fus)-[:IMPLICATED_IN {level: 'high', evidence_note: 'MN death'}]->(m_mn)
MERGE (tdp)-[:IMPLICATED_IN {level: 'high', evidence_note: 'TDP-43 pathology'}]->(m_agg)
MERGE (tdp)-[:IMPLICATED_IN {level: 'high', evidence_note: 'RNA metabolism'}]->(m_rna)
MERGE (tdp)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Stress granules'}]->(m_sg)
MERGE (tdp)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Transport'}]->(m_ax)
MERGE (tdp)-[:IMPLICATED_IN {level: 'low', evidence_note: 'Not cytoskeleton-primary'}]->(m_cyto_d)
MERGE (tdp)-[:IMPLICATED_IN {level: 'high', evidence_note: 'MN death'}]->(m_mn)
MERGE (optn)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Clearance / autophagy'}]->(m_auto)
MERGE (optn)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Inflammation links'}]->(m_inflam)
MERGE (optn)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Aggregation clearance'}]->(m_agg)
MERGE (optn)-[:IMPLICATED_IN {level: 'high', evidence_note: 'MN death'}]->(m_mn)
MERGE (tbk1)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Autophagy signaling'}]->(m_auto)
MERGE (tbk1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Innate immune / inflam'}]->(m_inflam)
MERGE (tbk1)-[:IMPLICATED_IN {level: 'high', evidence_note: 'MN death'}]->(m_mn)
MERGE (ubq)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Ubiquitin / proteostasis'}]->(m_auto)
MERGE (ubq)-[:IMPLICATED_IN {level: 'high', evidence_note: 'Aggregation / inclusions'}]->(m_agg)
MERGE (ubq)-[:IMPLICATED_IN {level: 'medium', evidence_note: 'Homeostasis'}]->(m_misfold)
MERGE (ubq)-[:IMPLICATED_IN {level: 'high', evidence_note: 'MN death'}]->(m_mn)
""",
]

# Backward-compat: some callers expect a single string
MECHANISM_SEED_CYPHER = STATEMENTS[0]
