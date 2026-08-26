from pathlib import Path

from rockgen_graph.client import get_driver
from rockgen_graph.mechanism_seed import STATEMENTS as MECHANISM_STATEMENTS


CONSTRAINTS_PATH = Path(__file__).resolve().parent.parent / "cypher" / "constraints.cypher"


def apply_constraints() -> None:
    driver = get_driver()
    statements = [
        s.strip()
        for s in CONSTRAINTS_PATH.read_text().split(";")
        if s.strip() and not s.strip().startswith("//")
    ]
    with driver.session() as session:
        for statement in statements:
            session.run(statement)


SEED_CYPHER = """
MERGE (disease:Disease {slug: 'als'})
SET disease.name = 'Amyotrophic Lateral Sclerosis',
    disease.synopsis = 'Progressive neurodegenerative disease of motor neurons.',
    disease.orphanets = ['ORPHA:803']

MERGE (gene:Gene {symbol: 'PFN1'})
SET gene.name = 'Profilin-1',
    gene.chromosome = '17p13.2'

MERGE (protein:Protein {uniprot_id: 'P07737'})
SET protein.symbol = 'PFN1',
    protein.name = 'Profilin-1',
    protein.organism = 'Homo sapiens',
    protein.length = 140,
    protein.sequence = 'MAGWNAYIDNLMADGTCQDAAIVGYKDSPSVWAAVPGKTFVNITPAEVGVLVGKDRSSFYVNGLTLGGQKCSVIRDSLLQDGEFSMDLRTKSTGGAPTFNVTVTKTDKTLVLLMGKEGVHGGLINKKCYEMASHLRRSQY'

MERGE (disease)-[:ASSOCIATED_WITH]->(gene)
MERGE (gene)-[:ENCODES]->(protein)

MERGE (mut:Mutation {key: 'PFN1:G118V'})
SET mut.gene_symbol = 'PFN1',
    mut.protein_uniprot = 'P07737',
    mut.hgvs_p = 'p.Gly118Val',
    mut.position = 118,
    mut.from_aa = 'G',
    mut.to_aa = 'V',
    mut.significance = 'Pathogenic association with familial ALS',
    mut.clinvar_status = 'Pathogenic / Likely pathogenic (literature)',
    mut.structural_region = 'core / near actin interface',
    mut.binding_context = 'near actin-binding face'

MERGE (mut_c71g:Mutation {key: 'PFN1:C71G'})
SET mut_c71g.gene_symbol = 'PFN1',
    mut_c71g.protein_uniprot = 'P07737',
    mut_c71g.hgvs_p = 'p.Cys71Gly',
    mut_c71g.position = 71,
    mut_c71g.from_aa = 'C',
    mut_c71g.to_aa = 'G',
    mut_c71g.significance = 'Pathogenic association with familial ALS',
    mut_c71g.clinvar_status = 'Pathogenic / Likely pathogenic (literature)',
    mut_c71g.structural_region = 'actin-binding face',
    mut_c71g.binding_context = 'actin-binding'

MERGE (mut_t109m:Mutation {key: 'PFN1:T109M'})
SET mut_t109m.gene_symbol = 'PFN1',
    mut_t109m.protein_uniprot = 'P07737',
    mut_t109m.hgvs_p = 'p.Thr109Met',
    mut_t109m.position = 109,
    mut_t109m.from_aa = 'T',
    mut_t109m.to_aa = 'M',
    mut_t109m.significance = 'ALS-associated variant; functional effects under study',
    mut_t109m.clinvar_status = 'Uncertain / conflicting in indexed catalogs',
    mut_t109m.structural_region = 'near PLP-binding / core interface',
    mut_t109m.binding_context = 'PLP-proximal'

MERGE (protein)-[:HAS_MUTATION]->(mut)
MERGE (protein)-[:HAS_MUTATION]->(mut_c71g)
MERGE (protein)-[:HAS_MUTATION]->(mut_t109m)
MERGE (mut)-[:LINKED_TO]->(disease)
MERGE (mut_c71g)-[:LINKED_TO]->(disease)
MERGE (mut_t109m)-[:LINKED_TO]->(disease)

MERGE (misfold:Phenotype {id: 'misfolding'})
SET misfold.name = 'Protein misfolding',
    misfold.description = 'Loss of native fold stability in PFN1 mutants'

MERGE (agg:Phenotype {id: 'aggregation'})
SET agg.name = 'Aggregation',
    agg.description = 'Cytoplasmic aggregates linked to motor neuron toxicity'

MERGE (struct:Phenotype {id: 'structural_change'})
SET struct.name = 'Structural change / reduced flexibility',
    struct.description = 'Local or global structural destabilization'

MERGE (mut)-[:CAUSES]->(misfold)
MERGE (mut)-[:CAUSES]->(struct)
MERGE (mut_c71g)-[:CAUSES]->(misfold)
MERGE (mut_c71g)-[:INCREASES_RISK]->(agg)
MERGE (mut_t109m)-[:CAUSES]->(struct)
MERGE (misfold)-[:LEADS_TO]->(agg)
MERGE (struct)-[:LEADS_TO]->(misfold)
MERGE (agg)-[:CONTRIBUTES_TO]->(disease)

MERGE (af:Structure {id: 'AF-P07737-F1'})
SET af.source = 'AlphaFold',
    af.url = 'https://alphafold.ebi.ac.uk/entry/P07737',
    af.method = 'predicted'

MERGE (pdb:Structure {id: '2PAV'})
SET pdb.source = 'PDB',
    pdb.url = 'https://www.rcsb.org/structure/2PAV',
    pdb.method = 'X-ray'

MERGE (protein)-[:HAS_STRUCTURE]->(af)
MERGE (protein)-[:HAS_STRUCTURE]->(pdb)

MERGE (pathway:Pathway {id: 'actin-cytoskeleton'})
SET pathway.name = 'Actin cytoskeleton regulation',
    pathway.source = 'curated'

MERGE (protein)-[:IN_PATHWAY]->(pathway)

MERGE (partner:Protein {uniprot_id: 'P60709'})
SET partner.symbol = 'ACTB',
    partner.name = 'Actin, cytoplasmic 1',
    partner.organism = 'Homo sapiens'

MERGE (protein)-[:INTERACTS_WITH]->(partner)

MERGE (paper1:Paper {id: 'pmid:23334667'})
SET paper1.title = 'Mutations in the profilin 1 gene cause familial amyotrophic lateral sclerosis',
    paper1.year = 2012,
    paper1.journal = 'Nature',
    paper1.url = 'https://pubmed.ncbi.nlm.nih.gov/23334667/'

MERGE (paper2:Paper {id: 'pmid:25447202'})
SET paper2.title = 'ALS-linked mutations enlarge the aggregation propensity of PFN1',
    paper2.year = 2014,
    paper2.journal = 'Hum Mol Genet',
    paper2.url = 'https://pubmed.ncbi.nlm.nih.gov/25447202/'

MERGE (protein)-[:MENTIONED_IN]->(paper1)
MERGE (mut)-[:MENTIONED_IN]->(paper1)
MERGE (disease)-[:MENTIONED_IN]->(paper1)
MERGE (mut)-[:MENTIONED_IN]->(paper2)
MERGE (protein)-[:MENTIONED_IN]->(paper2)

MERGE (trial:ClinicalTrial {nct_id: 'NCT02655497'})
SET trial.title = 'Study of ALS Biomarkers and Outcomes',
    trial.status = 'Completed',
    trial.phase = 'Observational',
    trial.url = 'https://clinicaltrials.gov/study/NCT02655497'

MERGE (disease)-[:STUDIED_IN]->(trial)

MERGE (biomarker:Biomarker {id: 'nfl-serum'})
SET biomarker.name = 'Serum Neurofilament Light Chain (NfL)',
    biomarker.modality = 'fluid',
    biomarker.biomarker_type = 'protein biomarker',
    biomarker.purpose = ['progression', 'prognosis', 'neuronal_injury'],
    biomarker.specimen = ['serum', 'plasma', 'CSF'],
    biomarker.disease_specificity = 'low',
    biomarker.protein_specificity = 'none',
    biomarker.pfn1_specific = false,
    biomarker.clinical_stage = 'research_and_clinical_studies',
    biomarker.clinical_maturity = 'moderate',
    biomarker.description = 'Neuronal injury / progression marker elevated in ALS and other neurological diseases — not PFN1-specific',
    biomarker.rockgen_connection = 'Potential ALS outcome marker; not a direct readout of PFN1 misfolding'

MERGE (biomarker)-[:INDICATES]->(disease)
MERGE (mut)-[:CONTEXTUAL_PROGRAM_MARKER]->(biomarker)
MERGE (trial)-[:MEASURES]->(biomarker)

MERGE (drug:Drug {id: 'riluzole'})
SET drug.name = 'Riluzole',
    drug.mechanism = 'Glutamate release inhibitor',
    drug.url = 'https://www.drugbank.ca/drugs/DB00740'

MERGE (drug)-[:INDICATED_FOR]->(disease)

MERGE (program:DrugProgram {id: 'als-pfn1-exploratory'})
SET program.name = 'PFN1 Aggregation Modulators',
    program.stage = 'Discovery',
    program.focus = 'Reduce mutant PFN1 aggregation'

MERGE (program)-[:TARGETS_PROTEIN]->(protein)
MERGE (program)-[:FOR_DISEASE]->(disease)
"""


def seed_graph() -> None:
    apply_constraints()
    driver = get_driver()
    with driver.session() as session:
        session.run(SEED_CYPHER)
        for stmt in MECHANISM_STATEMENTS:
            session.run(stmt)


def main() -> None:
    print("Applying constraints and seeding ALS / PFN1 / TUBA4A / mechanism graph...")
    seed_graph()
    print("Seed complete.")


if __name__ == "__main__":
    main()
